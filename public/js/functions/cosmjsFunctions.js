
const GAS_FEE_ADJUSTMENT = 1.3;
const TOKEN_DECIMALS = 18;

function getReward(delegatorAddress, validatorAddress, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpcEndpoint = currentChain.rpc_url;

  Tendermint34Client.connect(rpcEndpoint).then((tendermintClient) => {
    const queryClient = QueryClient.withExtensions(tendermintClient, setupDistributionExtension);
    queryClient.distribution.delegationRewards(delegatorAddress, validatorAddress)
      .then((rewardsResponse) => {
        if (!rewardsResponse) {
          return callback(null,'0');
        }

        const staked = (rewardsResponse.rewards).filter(reward => reward.denom == stakingdenom)[0];
        const stakedAmount =  `${Math.floor(staked.amount/ (10 ** TOKEN_DECIMALS))}`;
        
        return callback(null, stakedAmount);
      })
      .catch(err => {
        return callback('document_not_found');
      })
  }).catch(_ => {
    return callback('document_not_found');
  });
}

function getStake(delegatorAddress, validatorAddress, callback) {
  const rpcEndpoint = currentChain.rpc_url;
  
  Tendermint34Client.connect(rpcEndpoint).then((tendermintClient) => {

    const queryClient = QueryClient.withExtensions(tendermintClient, setupStakingExtension);
    queryClient.staking.delegation(delegatorAddress, validatorAddress).then((delegationResponse) => {
      if (!delegationResponse) {
        return callback('document_not_found');
      }
      const stakedAmount = delegationResponse.delegationResponse.balance.amount;
      return callback(null, stakedAmount);
    }).catch(_ => {
      return callback('document_not_found');
    });
  }
  ).catch(_ => {
    return callback('document_not_found');
  });
}
    
function completeStake(offlineSigner, accounts, currentChain, stakingValue) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const validatorAddress = currentChain.validator_address
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  stakingValue = parseFloat(stakingValue) * (10 ** currentChainInfo.currencies[0].coinDecimals);
  const memo = "stake from node101 website";

  const DelegateMsg = MsgDelegate.fromPartial({
     delegatorAddress: accounts.address,
     validatorAddress: validatorAddress,
     amount: {
       denom: stakingdenom,
       amount: stakingValue.toString()
     }
   });

  const DelegateTransaction = {
    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    value: DelegateMsg,
  };

  let globalSigningClient;
  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
    .then((signingClient) => {
      globalSigningClient = signingClient;
      return signingClient.simulate(accounts.address, [DelegateTransaction]);
    }).then((gas)=> {
      const fee = {
        amount: [
          {
            denom: currentChainInfo.feeCurrencies[0].coinMinimalDenom,
            amount: "0",
          },  
        ],
        gas: Math.round(gas * GAS_FEE_ADJUSTMENT).toString(),
      };

      return globalSigningClient.signAndBroadcast(accounts.address, [DelegateTransaction], fee, memo);
    }).then((gasUsed) => {
      console.log("Gas used: ", gasUsed);
      if (gasUsed.code === 0) {
        alert("Transaction successful");
        console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
      } else  {
        alert("Transaction failed");
      }
    }).catch((err) => {
      console.log(err);
  });
};

function completeRestake(offlineSigner, accounts, currentChain) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "restake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getReward(accounts.address, validatorAddress, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const UndelegateMsg = 
    MsgUndelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress,
      amount: {
        denom: stakingdenom,
        amount: data
      }
    });

    const UndelegateTransaction = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: UndelegateMsg,
    };

    const DelegateMsg = MsgDelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress,
      amount: {
        denom: stakingdenom,
        amount: data
      }
    });

    const DelegateTransaction = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: DelegateMsg,
    };

    let globalSigningClient;
    SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
    .then((signingClient) => {
      globalSigningClient = signingClient;
      return signingClient.simulate(accounts.address, [UndelegateTransaction,DelegateTransaction]);
    }).then((gasEstimate )=> {
      const fee = {
        amount: [
          {
            denom: currentChainInfo.feeCurrencies[0].coinMinimalDenom,
            amount: "0",
          },  
        ],
        gas: Math.round(gasEstimate * GAS_FEE_ADJUSTMENT).toString(),
      };

      return globalSigningClient.signAndBroadcast(accounts.address, [UndelegateTransaction,DelegateTransaction], fee, memo);
    }).then((gasUsed) => {
      console.log("Gas used: ", gasUsed);
      if (gasUsed.code === 0) {
        alert("Transaction successful");
        console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
      } else  {
        alert("Transaction failed");
      }
    }).catch((err) => {
      console.log(err);
    })
  });
};

function completeUnstake(offlineSigner, accounts, currentChain) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "unstake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getReward(accounts.address, validatorAddress, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const UndelegateMsg = 
    MsgUndelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress,
      amount: {
        denom: stakingdenom,
        amount: data
      }
  })



  const UndelegateTransaction = {
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
    value: UndelegateMsg,
  };

  let globalSigningClient;
  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
  .then((signingClient) => {
    globalSigningClient = signingClient;
    return signingClient.simulate(accounts.address, [UndelegateTransaction]);
  }).then((gasEstimate )=> {
    const fee = {
      amount: [
        {
          denom: currentChainInfo.feeCurrencies[0].coinMinimalDenom,
          amount: "0",
        },  
      ],
      gas: Math.round(gasEstimate * GAS_FEE_ADJUSTMENT).toString(),
    };

    return globalSigningClient.signAndBroadcast(accounts.address, [UndelegateTransaction], fee, memo);
  }).then((gasUsed) => {
    console.log("Gas used: ", gasUsed);
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }
  }).catch((err) => {
    console.log(err);
  })
});
};
  



function completeRedelgation(offlineSigner, accounts, currentChain, validatorAddress) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "redelegate from node101 website";

  getStake(accounts.address, validatorAddress, (err, reward) => {
      if (err) {
        console.log(err);
        return;
      }

      const RedelegateMsg = 
        MsgBeginRedelegate.fromPartial({
          delegatorAddress: accounts.address,
          validatorSrcAddress: validatorAddress,
          validatorDstAddress: currentChain.validator_address,
        amount: {
          denom: stakingdenom,
          amount: reward.toString()
        }
      })

  const RedelegateTransaction = {
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    value: RedelegateMsg,
  };

  const fee = {
    amount: [
      {
        denom: stakingdenom,
        amount: 10,
      },
    ],
    gas: "1200000", //950k 
  };

  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
      .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [RedelegateTransaction],fee,memo))
      .then((gasUsed) => {
        console.log("Gas used: ", gasUsed);
    console.log("codee", gasUsed.code) 
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }

    console.log("Gas used: ", gasUsed);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
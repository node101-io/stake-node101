
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
        console.log(err);
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
      const stakedAmount = `${delegationResponse.delegationResponse.balance.amount}`;
      return callback(null, stakedAmount);
    }).catch(_ => {
      return callback('document_not_found');
    });
  }
  ).catch(_ => {
    return callback('document_not_found');
  });
}

function completeStake(offlineSigner, accounts, currentChain, stakingValue, callback) {
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
            denom: stakingdenom,
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
      return callback(null);
    }).catch((err) => {
      return callback(err);
  });
};

function completeRestake(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "restake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getReward(accounts.address, validatorAddress, (err, data) => {
    if (err) {
      return callback(err);
    }

    const WithdrawRewardMsg = MsgWithdrawDelegatorReward.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress
    });

    const WithdrawRewardTransaction = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: WithdrawRewardMsg,
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
      return signingClient.simulate(accounts.address, [WithdrawRewardTransaction,DelegateTransaction]);
    }).then((gasEstimate )=> {
      const fee = {
        amount: [
          {
            denom: stakingdenom,
            amount: "0",
          },  
        ],
        gas: Math.round(gasEstimate * GAS_FEE_ADJUSTMENT).toString(),
      };

      return globalSigningClient.signAndBroadcast(accounts.address, [WithdrawRewardTransaction,DelegateTransaction], fee, memo);
    }).then((gasUsed) => {
      console.log("Gas used: ", gasUsed);
      if (gasUsed.code === 0) {
        alert("Transaction successful");
        console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
      } else  {
        alert("Transaction failed");
      }
      return callback(null);
    }).catch((err) => {
      return callback(err);
    })
  });
};

function completeWithdraw(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "withdraw stake from node101 website";
  const validatorAddress = currentChain.validator_address;

  
  const WithdrawRewardMsg = MsgWithdrawDelegatorReward.fromPartial({
    delegatorAddress: accounts.address,
    validatorAddress: validatorAddress
  });

  const WithdrawRewardTransaction = {
    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    value: WithdrawRewardMsg,
  };


  let globalSigningClient;
  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
  .then((signingClient) => {
    globalSigningClient = signingClient;
    return signingClient.simulate(accounts.address, [WithdrawRewardTransaction]);
  }).then((gasEstimate )=> {
    const fee = {
      amount: [
        {
          denom: stakingdenom,
          amount: "0",
        },  
      ],
      gas: Math.round(gasEstimate * GAS_FEE_ADJUSTMENT).toString(),
    };

    return globalSigningClient.signAndBroadcast(accounts.address, [WithdrawRewardTransaction], fee, memo);
  }).then((gasUsed) => {
    console.log("Gas used: ", gasUsed);
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }
    return callback(null);
  }).catch((err) => {
    return callback(err);
  })
};

function completeUnstake(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "unstake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getStake(accounts.address, validatorAddress, (err, data) => {
    if (err) {
      return callback(err);
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
          denom: stakingdenom,
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
    return callback(null);
  }).catch((err) => {
    return callback(err);
  })
});
};

function completeRedelegate(offlineSigner, accounts, currentChain, validatorAddress, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "redelegate from node101 website";

  getStake(accounts.address, validatorAddress, (err, reward) => {
      if (err) {
        return callback(err);
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

  let globalSigningClient;
  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
  .then((signingClient) => {
    globalSigningClient = signingClient;
    return signingClient.simulate(accounts.address, [RedelegateTransaction]);
  }).then((gasEstimate )=> {
    const fee = {
      amount: [
        {
          denom: stakingdenom,
          amount: "0",
        },  
      ],
      gas: Math.round(gasEstimate * GAS_FEE_ADJUSTMENT).toString(),
    };

    return globalSigningClient.signAndBroadcast(accounts.address, [RedelegateTransaction], fee, memo);
  }).then((gasUsed) => {
    console.log("Gas used: ", gasUsed);
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }
    return callback(null);
  }).catch((err) => {
    return callback(err);
  })
});
};
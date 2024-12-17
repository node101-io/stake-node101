const GAS_FEE_ADJUSTMENT = 1.3;
const TOKEN_DECIMALS = 18;

function connect(network) {
    return new Promise(async (resolve, reject) => {
        try {
            await keplr.experimentalSuggestChain(network);
            await keplr.enable(network.chainId);

            resolve({ success: true });
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
}

function disconnect() {
    if (keplr.disconnect) keplr.disconnect();
    if (keplr.disable) keplr.disable();
}

function getAccounts(network) {
    return new Promise(async (resolve, reject) => {
        try {
            const offlineSigner = keplr.getOfflineSigner(network.chainId);
            const accounts = await offlineSigner.getAccounts();
            resolve(accounts);
        } catch (error) {
            reject(error.message);
        }
    });
}

function buildPayForBlob(tx, blob) {
    let blobTx = new proto.BlobTx();
    blobTx.setTx(tx);
    blobTx.setTypeId("BLOB");
    blobTx.addBlobs(blob);
    return blobTx.serializeBinary();
}

async function sendPayForBlob(network, sender, proto, fee, blob) {
    const account = await fetchAccountInfo(network, sender);
    const { pubKey } = await keplr.getKey(network.chainId);

    const tx = TxBody.encode(
        TxBody.fromPartial({
            messages: proto,
            memo: "Sent via Celenium.io",
        }),
    ).finish();

    if (account) {
        const signDoc = {
            bodyBytes: tx,
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    {
                        publicKey: {
                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            value: PubKey.encode({
                                key: pubKey,
                            }).finish(),
                        },
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    },
                ],
                fee: Fee.fromPartial({
                    amount: fee.amount.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                    gasLimit: fee.gas,
                }),
            }).finish(),
            chainId: network.chainId,
            accountNumber: Long.fromString(account.account_number),
        };

        const signed = await keplr.signDirect(network.chainId, sender, signDoc);

        const body = buildPayForBlob(
            TxRaw.encode({
                bodyBytes: signed.signed.bodyBytes,
                authInfoBytes: signed.signed.authInfoBytes,
                signatures: [decodeSignature(signed.signature.signature)],
            }).finish(),
            blob,
        );

        const signedTx = {
            tx: body,
            signDoc: signed.signed,
        };

        const txHash = await broadcastTxSync(network.chainId, signedTx.tx);
        return Buffer.from(txHash).toString("hex");
    }
}

async function simulateMsgs(network, sender, proto, fee) {
    const account = await fetchAccountInfo(network, sender);

    if (account) {
        const unsignedTx = TxRaw.encode({
            bodyBytes: TxBody.encode(
                TxBody.fromPartial({
                    messages: proto,
                    memo: "",
                }),
            ).finish(),
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    SignerInfo.fromPartial({
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    }),
                ],
                fee: Fee.fromPartial({
                    amount: fee.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                }),
            }).finish(),
            signatures: [new Uint8Array(64)],
        }).finish();

        const simulatedResult = await $fetch(`${network.rest}/cosmos/tx/v1beta1/simulate`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                tx_bytes: Buffer.from(unsignedTx).toString("base64"),
            }),
        });

        const gasUsed = parseInt(simulatedResult.gas_info.gas_used);
        if (Number.isNaN(gasUsed)) {
            throw new Error(`Invalid integer gas: ${simulatedResult.gas_info.gas_used}`);
        }

        return gasUsed * 1.2;
    }

    return undefined;
}

async function sendMsgs(network, sender, proto, fee) {
    const account = await fetchAccountInfo("network", sender);
    const { pubKey } = await keplr.getKey('celestia');

   
    const tx = TxBody.encode(
        TxBody.fromPartial({
            messages: proto,
            memo: "Sent via node101.io",
        }),
    ).finish();


    if (account) {
        
        const signDoc = {
            bodyBytes: tx,
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    {
                        publicKey: {
                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            value: PubKey.encode({
                                key: pubKey,
                            }).finish(),
                        },
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    },
                ],
                fee: Fee.fromPartial({
                    amount: fee.amount.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                    gasLimit: fee.gas,
                }),
            }).finish(),
            chainId: network.chainId,
           accountNumber: Long.fromString(account.account_number),
        };


        const signed = await keplr.signDirect(network.chainId, sender, signDoc);

        const signedTx = {
            tx: TxRaw.encode({
                bodyBytes: signed.signed.bodyBytes,
                authInfoBytes: signed.signed.authInfoBytes,
                signatures: [decodeSignature(signed.signature.signature)],
            }).finish(),
            signDoc: signed.signed,
        };
     
        console.log(Buffer.from(signedTx.tx).toString("hex"));
        const txHash = await broadcastTxSync(network.chainId, signedTx.tx);
        return Buffer.from(txHash).toString("hex");
    }
}

async function fetchAccountInfo(network, address) {
  const rest = "https://rest.cosmos.directory/celestia"
    try {
        const uri = `${rest}/cosmos/auth/v1beta1/accounts/${address}`;
        console.log(uri);
        const response = await fetch(uri);
        const data = await response.json();
        return data.account;
    } catch (e) {
        return undefined;
    }
}

async function broadcastTxSync(chainId, tx) {
    return keplr.sendTx(chainId, tx, "sync");
}

function fromHexString(hexString) {
    return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

function decodeSignature(s) {
    return fromHexString(Base64.parse(s).toString(Hex));
}



function getReward(delegatorAddress, validatorAddress, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpc_url = currentChain.rpc_url;

  Tendermint34Client.connect(rpc_url).then((tendermintClient) => {
    const queryClient = QueryClient.withExtensions(tendermintClient, setupDistributionExtension);
    queryClient.distribution.delegationRewards(delegatorAddress, validatorAddress)
      .then((rewardsResponse) => {
        if (!rewardsResponse) return callback(null,'0');
        
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
  const rpc_url = currentChain.rpc_url;

  Tendermint34Client.connect(rpc_url).then((tendermintClient) => {
    const queryClient = QueryClient.withExtensions(tendermintClient, setupStakingExtension);
    queryClient.staking.delegation(delegatorAddress, validatorAddress).then((delegationResponse) => {
      if (!delegationResponse) return callback(null,'0');
      
      const stakedAmount = `${delegationResponse.delegationResponse.balance.amount}`;
      return callback(null, stakedAmount);
    }).catch(err => {
      console.log(err);
      return callback('document_not_found');
    });
  }
  ).catch(_ => {
    return callback('document_not_found');
  });
}

function completeStake(offlineSigner, accounts, currentChain, stakingValue, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const rpc_url = currentChain.rpc_url;
  const validatorAddress = currentChain.validator_address;
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "stake from node101 website";
  stakingValue = parseFloat(stakingValue) * (10 ** currentChainInfo.currencies[0].coinDecimals);
  
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

  completeTransaction(offlineSigner, accounts, [DelegateTransaction], rpc_url, stakingdenom, memo, (err,data) => {
    if (err) return callback(err);

    return callback(null);
  });
  return callback(null);
}; 

function completeRestake(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpc_url = currentChain.rpc_url;
  const memo = "restake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getReward(accounts.address, validatorAddress, (err, data) => {
    if (err) return callback(err);

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

    completeTransaction(offlineSigner, accounts, [WithdrawRewardTransaction, DelegateTransaction], rpc_url, stakingdenom, memo, (err,data) => {
      if (err) return callback(err);
      return callback(null);
    });
  });
};

function completeWithdraw(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpc_url = currentChain.rpc_url;
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

  completeTransaction(offlineSigner, accounts, [WithdrawRewardTransaction], rpc_url, stakingdenom, memo, (err,data) => {
    if (err) return callback(err);
    return callback(null);
  });
};  

function completeUnstake(offlineSigner, accounts, currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpc_url = currentChain.rpc_url;
  const memo = "unstake from node101 website";
  const validatorAddress = currentChain.validator_address;

  getStake(accounts.address, validatorAddress, (err, data) => {
    if (err) return callback(err);

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

    completeTransaction(offlineSigner, accounts, [UndelegateTransaction], rpc_url, stakingdenom, memo, (err,data) => {
      if (err) return callback(err);
      return callback(null);
    });
  });
};

function completeRedelegate(offlineSigner, accounts, currentChain, validatorAddress, redelegateAmount, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpc_url = currentChain.rpc_url;
  const memo = "redelegate from node101 website";
  redelegateAmount = parseFloat(redelegateAmount) * (10 ** currentChainInfo.currencies[0].coinDecimals);

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
        amount: redelegateAmount.toString(),
      }
    })

    console.log(RedelegateMsg);

    const RedelegateTransaction = {
      typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
      value: RedelegateMsg,
    };
    console.log(RedelegateTransaction)
    completeTransaction(offlineSigner, accounts, [RedelegateTransaction], rpc_url, stakingdenom, memo, (err,data) => {
      if (err) return callback(err);
      return callback(null);
    });
  });
};

function completeTransaction(offlineSigner, accounts, msgs, rpc_url, stakingdenom, memo, callback) {
  
  let globalSigningClient;
  SigningStargateClient.connectWithSigner(rpc_url,offlineSigner)
    .then((signingClient) => {
      globalSigningClient = signingClient;
      return signingClient.simulate(accounts.address, msgs);
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

      return globalSigningClient.signAndBroadcast(accounts.address, msgs, fee, memo);
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

async function TryKey(network, key,  callback) {
  const myaddress = "celestia1v69uuyn2vujg9f9svy2u47tft925yj67ffygj8"
  const valiaddress = "celestiavaloper1lrzxwu4dmy8030waevcpft7rpxjjz26csrtqm4";
  const proto = [
    {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: MsgDelegate.encode({
        delegatorAddress: myaddress,
        validatorAddress: valiaddress,
        amount: {
          denom: "utia",
          amount: "10000000000000000",
        },
      }).finish(),
    },
  ]
  const stdFee = {
    amount: [
      {
        denom: "utia",
        amount: 0,
      },
    ],
    gas: 200000,
  }
  const txHash =  sendMsgs(network, key.bech32Address, proto, stdFee).then((txHash) => {
    console.log("txHash", txHash);
  })
  console.log(await txHash);
  return callback(null);
}
function addChainToKeplr(currentChain, callback) {
  const keplr = window.keplr;
  let currentChainInfo = JSON.parse(currentChain.chain_info);
  const coinMinimalDen = currentChainInfo.currencies[0].coinMinimalDenom;

  keplr.experimentalSuggestChain(currentChainInfo).then(() => {

    keplr.enable(currentChain.chain_id).then(() => {
      
      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().then((accounts) => {
        const address = accounts[0].address;

        SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner).then((signingClient) => {
          signingClient.getBalance(address, coinMinimalDen).then(balance => {

            const myBalance = balance.amount;

            walletAddValue.textContent = address.slice(0, 5) + "..." + address.slice(-5);
            walletBalValue.textContent = myBalance / 1000000 + " " + currentChainInfo.currencies[0].coinDenom;
            walletchainValue.textContent = currentChainInfo.chainName;
            walletTokenValue.textContent = currentChainInfo.currencies[0].coinDenom;

            callback(null);
          }).catch((err) => {
            return callback(err);
          });
        }).catch((err) => {
          return callback(err);
        });
      }).catch((err) => {
        return callback(err);
      });
    }).catch((err) => {
      return callback(err);
    });
  }).catch((err) => {
    return callback(err);
  });
};

function setTokenUI(currentChain) {
  const tokenImage = document.getElementById('tokenImg');
  const tokenName = document.getElementById('tokenName');

  tokenImage.src = currentChain.img_url;
  tokenName.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom
};

window.addEventListener('load',  () => {
  let currentChain; 

  document.addEventListener('click', event => {
    if (event.target.closest('.tokenWrapper')) {
      document.querySelector('.token-popup-wrapper').classList.toggle('display-none');
    };

    if (event.target.closest('.token-tile')) {
      const chain_id = event.target.closest('.token-tile').querySelector('#tokenId').value;

      serverRequest(`/chain?chain_id=${chain_id}`, 'GET', {}, res => {
        if (res.error) {
          console.log(res);
        } else {
          currentChain = res.chainInfo;

          addChainToKeplr(currentChain);
          setTokenUI(currentChain);
        }
      });

      document.querySelector('.token-popup-wrapper').classList.toggle('display-none');
    };

    if (event.target.closest('#connect-button')) {
      currentChain = !currentChain ? JSON.parse(document.getElementById('chain-info-element').value) : currentChain;

      if (!window.keplr) {
        console.log("Keplr extension not installed");
        return;
      };
      addChainToKeplr(currentChain, (err) => {
        if (err) console.log(err);

      });
    };

    if (event.target.closest('#stake-button')) {

     const keplr = window.keplr;
     if (!currentChain) {
        console.log("Please connect to a chain");
        return;
      };

      const stakingValue =  document.getElementById('stake-amount').value;

      if (!stakingValue || isNaN(stakingValue) || stakingValue <= 0) {
        console.log("Please enter a valid amount");
        return;
      };

      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().then((accounts) => {
      completeStaking(offlineSigner, accounts[0], currentChain, stakingValue); 
    
      });
    };
  });
});

function completeStaking(offlineSigner, accounts, currentChain, stakingValue) {
      const currentChainInfo = JSON.parse(currentChain.chain_info);
      const validatorAddress = currentChain.validator_address
      const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
      const memo = "Use your power wisely";

       const DelegateMsg = MsgDelegate.fromPartial({
         delegatorAddress: accounts.address,
         validatorAddress: validatorAddress,
         amount: {
           denom: currentChainInfo.currencies[0].coinMinimalDenom,
           amount: stakingValue
         },
       });

       const DelegateTransaction = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: DelegateMsg,
      };

      const fee = {
        amount: [
          {
            denom: stakingdenom,
            amount: stakingValue,
          },
        ],
        gas: "980000", //980k 
      };

      SigningStargateClient.connectWithSigner(
        currentChain.rpc_url,
        offlineSigner
      ).then((signingClient)=>

       signingClient.signAndBroadcast(
         accounts.address,
         [DelegateTransaction],
         fee,
         memo
       ).then((completeStaking) => {


       if (completeStaking.code === 0) {

         alert("Transaction successful");
       } else {
         alert("Transaction failed");
       };
       signingClient.getBalance(address, coinMinimalDen).then(balance => {
        if (err) return callback(err);

        const myBalanc = balance.amount;

      walletBalValue.textContent = myBalanc / 1000000 + " " + stakingdenom;
      });
    }
  ));
}
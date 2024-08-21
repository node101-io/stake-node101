let globalOfflineSigner;
let globalAddress;
/*
function addChainToKeplr(currentChain, callback) {
  const keplr = window.keplr;
  const currentChainInfo = JSON.parse(currentChain.chain_info);

  keplr.experimentalSuggestChain(currentChainInfo)
    .then(keplr.enable(currentChain.chain_id))
    .then(keplr.getOfflineSigner(currentChain.chain_id))
    .then((offlineSigner) => {
      globalOfflineSigner = offlineSigner;
      return offlineSigner.getAccounts();
    })
    .then((accounts) => {
      globalAddress = accounts[0].address;
    })
    .then(SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner))
    .then((signingClient) => signingClient.getBalance(address, currentChainInfo.  currencies[0].coinMinimalDenom))
    .then(balance => {

      walletAddValue.textContent = address.slice(0, 5) + "..." + address.slice(-5);
      walletBalValue.textContent =  balance.amount / 1000000 + " " + currentChainInfo.currencies[0].coinDenom;
      walletchainValue.textContent = currentChainInfo.chainName;
      walletTokenValue.textContent = currentChainInfo.currencies[0].coinDenom;

      return callback(null);

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
      offlineSigner.getAccounts().
      then((accounts) => {
        completeStaking(offlineSigner, accounts[0], currentChain, stakingValue); 
      }).catch((err) => {
        console.log(err);
        return;
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

      SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
      .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [DelegateTransaction],fee,memo))
      .then((code) => {
        if (code === 0) {
          alert("Transaction successful");
        } else {
          alert("Transaction failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
}; */


function addChainToKeplr(currentChain, callback) {
  const keplr = window.keplr;
  const currentChainInfo = JSON.parse(currentChain.chain_info);

  keplr.experimentalSuggestChain(currentChainInfo)
    .then(() => keplr.enable(currentChain.chain_id))
    .then(() => keplr.getOfflineSigner(currentChain.chain_id))
    .then((offlineSigner) => {
      globalOfflineSigner = offlineSigner;
      console.log('11111111');
      console.log(currentChain.rpc_url);
      console.log('22222222');
      return offlineSigner.getAccounts();
    })
    .then((accounts) => {
      globalAddress = accounts[0].address;
      return SigningStargateClient.connectWithSigner(currentChain.rpc_url, globalOfflineSigner);
    })
    .then((signingClient) => {
  
      signingClient.getBalance(globalAddress, currentChainInfo.  currencies[0].coinMinimalDenom)
})
    .then(balance => {

      document.querySelector('.content-header-title').textContent = globalAddress.slice(0, 10) + "...";

      return callback(null);

    }).catch((err) => {
      return callback(err);
  });
};

window.addEventListener('load',  () => {
  let currentChain; 




  document.addEventListener('input', event => {
    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-list-search-input')) {
      const searchValue = event.target.value.toLowerCase();
      const chains = document.querySelectorAll('.content-wrapper-stake-body-main-center-body-chain-list-each');

      chains.forEach(function(chain) {
        const chainName = chain.getAttribute('data-chainname');
        if (chainName.includes(searchValue)) {
          chain.style.display = '';
        } else {
          chain.style.display = 'none';
        }
      });
    }
  });

  document.addEventListener('click', event => {
    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-name')) {
      document.querySelector('.content-wrapper-stake-body-main-center-body-chain-list').classList.toggle('display-none');
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
  });

  document.addEventListener('click', event => {
    if (event.target.closest(' .content-header-title')) {
    console.log(document.getElementById('chainInfoElement').value);
   
    currentChain = !currentChain ? JSON.parse(document.getElementById('chainInfoElement').value) : currentChain;
    
    if (!window.keplr) {
      console.log("Keplr extension not installed");
      return;
    };
    console.log("Adding chain");
    addChainToKeplr(currentChain, (err) => {
      if (err) console.log(err);

        });
      };
    });
  });
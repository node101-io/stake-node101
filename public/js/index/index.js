
let currentChain;
let globalAddress;
let globalBalance;

function saveToSession(data, callback) {
  if (!data || typeof data != 'object')
    return callback(null);

  serverRequest('/session/set', 'POST' , data, (res, err) => {
    if (err) return callback(err);

    return callback(null);
  });
};

function setTokenUI(currentChain) {
  const tokenImage = document.querySelector('.content-wrapper-stake-body-main-center-body-icon-img');
  const tokenName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-token');
  const chainName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-name-network');

  tokenImage.src = currentChain.img_url;
  tokenName.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
  chainName.textContent = JSON.parse(currentChain.chain_info).chainName;
};

function addChainToKeplr(currentChain, callback) {
  const keplr = window.keplr;
  let globalOfflineSigner
  const currentChainInfo = JSON.parse(currentChain.chain_info);

  keplr.experimentalSuggestChain(currentChainInfo)
    .then(() => keplr.enable(currentChain.chain_id))
    .then(() => keplr.getOfflineSigner(currentChain.chain_id))
    .then((offlineSigner) => {
      globalOfflineSigner = offlineSigner;
      return offlineSigner.getAccounts();
    })
    .then((accounts) => {
      globalAddress = accounts[0].address;
      return SigningStargateClient.connectWithSigner(currentChain.rpc_url, globalOfflineSigner);
    })
    .then((signingClient) => {
      return signingClient.getBalance(globalAddress, currentChainInfo.currencies[0].coinMinimalDenom);
    })
    .then((balance) => {
      globalBalance = Math.round(((100 * balance.amount) / (10 ** currentChainInfo.currencies[0].coinDecimals)) )/100 + " " + currentChainInfo.currencies[0].coinDenom;

      document.querySelector('.content-header-title').textContent = globalAddress.slice(0, 10) + "...";
      document.querySelector('.content-wrapper-stake-body-main-center-title-amount').textContent = Math.round(((100 * balance.amount) / (10 ** currentChainInfo.currencies[0].coinDecimals)) )/100 + " " + currentChainInfo.currencies[0].coinDenom;

      saveToSession({
        currentChainKey: currentChain.chain_id,
        globalAddressKey: globalAddress,
        globalBalanceKey: globalBalance,
      }, (err,res) => {
        if (err) return console.log(err);
      });

      return callback(null);
    }).catch((err) => {
      return callback(err);
    });
};

function completeStaking(offlineSigner, accounts, currentChain, stakingValue) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const validatorAddress = currentChain.validator_address
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  stakingValue = parseFloat(stakingValue) * (10 ** currentChainInfo.currencies[0].coinDecimals);
  const memo = "Use your power wisely";

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

  const fee = {
    amount: [
      {
        denom: stakingdenom,
        amount: stakingValue,
      },
    ],
    gas: "950000", //950k
  };

  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
  .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [DelegateTransaction],fee,memo))
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
  }).catch((err) => {
    console.log(err);
  });
};

function getCurrentChain() {
  serverRequest(`/chain?chain_id=${chain_id}`, 'GET', {}, res => {
    if (res.error) {
      console.log(res);
    } else {
      currentChain = res.chainInfo;
    }
  }
)};


let counter = 0;
let elx ;
let children ;

let classNames;

function carosoul() {

 /*  if (step == "left") {
    counter -= 3;
  } */
  classNames[(counter - 1) %(classNames.length)].style.zIndex = 0;
  classNames[(counter )  % (classNames.length)].style.zIndex = 500;

  //classNames[1].style.zIndex = '100';
  counter++;

/* 
  setTimeout(() => {
    carosoul();
  }, 2000); */
};


window.addEventListener('load',  async() => {
  //carosoul();
  document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').focus();
  currentChain = JSON.parse(document.getElementById('chainInfoElement').value);
  globalAddress = document.getElementById('globalAddressElement')?.value || "";
  setTokenUI(JSON.parse(document.getElementById('chainInfoElement').value));

  
  elx = document.querySelectorAll('.content-wrapper-info-body-content');
  children = console.log(elx);
  classNames =  Array.from(elx);

  console.log(classNames);

  document.addEventListener('input', event => {
    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-list-search-input')) {
      const searchValue = event.target.value.toLowerCase();
      console.log(searchValue)
      const chains = document.querySelectorAll('.content-wrapper-stake-body-main-center-body-chain-list-each');
      console.log(chains)
      chains.forEach(chain => {
        if ((chain.getAttribute('data-chain-name')).includes(searchValue) || (chain.getAttribute('data-coin-name')).includes(searchValue))
          chain.style.display = '';
        else
          chain.style.display = 'none';
      })
    }

    if (event.target.closest('.content-wrapper-stake-body-main-center-body-stake-amount')) {
      
      const stakingValue = event.target.value;
      const stakingAmount = document.querySelector('.content-wrapper-stake-body-main-center-body-stake-dollar');
      stakingAmount.textContent = "$"+ (stakingValue *  currentChain.price).toFixed(2);

      const aprTokenDaily = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-daily');
      aprTokenDaily.textContent = (stakingValue * (currentChain.apr/100)/365).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
      const aprPriceDaily = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-daily');
      aprPriceDaily.textContent = "$" + (stakingValue * (currentChain.apr/100)/365 * currentChain.price).toFixed(2);

      const aprTokenMonthly = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-monthly');
      aprTokenMonthly.textContent = (stakingValue * (currentChain.apr/100)/12).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
      const aprPriceMonthly = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-monthly');
      aprPriceMonthly.textContent = "$" + (stakingValue * (currentChain.apr/100)/12.16 * currentChain.price).toFixed(2);

      const aprTokenYearly = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-yearly');
      aprTokenYearly.textContent = ((stakingValue/100) * (currentChain.apr)).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
      const aprPriceYearly = document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-yearly');
      aprPriceYearly.textContent = "$" + (stakingValue * (currentChain.apr/100) * currentChain.price).toFixed(2);

    }
  });

  document.addEventListener('click', event => {

    if (event.target.closest('.content-wrapper-stake-body-main-center-title-each.content-wrapper-stake-body-main-center-title-half')) {
      const balance = document.querySelector('.content-wrapper-stake-body-main-center-title-amount').innerText;
      document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').value = ((balance.match(/\d+(\.\d+)?/) || [0])[0])/2 > 0.02 ? ((balance.match(/\d+(\.\d+)?/) || [0])[0])/2 : 0;
    }

    if (event.target.closest('.content-wrapper-stake-body-main-center-title-each.content-wrapper-stake-body-main-center-title-max')) {
      const balance = document.querySelector('.content-wrapper-stake-body-main-center-title-amount').innerText;
      document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').value = ((balance.match(/\d+(\.\d+)?/) || [0])[0]) > 0.02 ? ((balance.match(/\d+(\.\d+)?/) || [0])[0]) - 0.02 : 0;
    }


    if (event.target.closest('.content-wrapper-info-body-larrow')) {
      carosoul();
    }


    if (event.target.closest('.content-wrapper-info-body-rarrow')) {
      carosoul();
    }

    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-name')) {
      document.querySelector('.content-wrapper-stake-body-main-center-body-chain-list').classList.toggle('display-none');
    };

    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-list-each')) {

      const chain_id = event.target.closest('.content-wrapper-stake-body-main-center-body-chain-list-each').querySelector('.content-wrapper-stake-body-main-center-body-chain-list-each-id').textContent;
      serverRequest(`/chain?chain_id=${chain_id}`, 'GET', {}, res => {
        if (res.error) {
          console.log(res);
        } else {
          currentChain = res.chainInfo;

          addChainToKeplr(currentChain, (err) => {
            if (err) console.log;

            setTokenUI(currentChain);
          });

        }
      });

      document.querySelector('.content-wrapper-stake-body-main-center-body-chain-list').classList.toggle('display-none');
    };


    if (event.target.closest('.content-header-title')) {

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


    if (event.target.closest('.content-wrapper-stake-body-button')) {
      const keplr = window.keplr;
      if (!currentChain) {

        return;
      };


      const inputElement = document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount');
      const stakingValue = inputElement.value;

      if (!stakingValue ) {
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
  })
});

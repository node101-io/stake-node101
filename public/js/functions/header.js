function addChainToKeplr(currentChain, callback) {
  const keplr = window.keplr;
  let globalOfflineSigner;
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

function saveToSession(data, callback) {
  if (!data || typeof data != 'object')
    return callback(null);

  serverRequest('/session/set', 'POST' , data, (res, err) => {
    if (err) return callback(err);

    return callback(null);
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

function setTokenUI(currentChain) {
  const tokenImage = document.querySelector('.content-wrapper-stake-body-main-center-body-icon-img');
  const tokenName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-token');
  const chainName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-name-network');

  tokenImage.src = currentChain.img_url;
  tokenName.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
  chainName.textContent = JSON.parse(currentChain.chain_info).chainName;
};

function setAmountUI(stakingValue) {
  document.querySelector('.content-wrapper-stake-body-main-center-body-stake-dollar').textContent = "$" + (stakingValue * currentChain.price).toFixed(2);
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-daily').textContent = (stakingValue * (currentChain.apr/100)/365).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-daily').textContent = "$" + (stakingValue * (currentChain.apr/100)/365 * currentChain.price).toFixed(2);
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-monthly').textContent = (stakingValue * (currentChain.apr/100)/12).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-monthly').textContent = "$" + (stakingValue * (currentChain.apr/100)/12.16 * currentChain.price).toFixed(2);
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token-yearly').textContent = ((stakingValue/100) * (currentChain.apr)).toFixed(2) + " " + JSON.parse(currentChain.chain_info).currencies[0].coinDenom;
  document.querySelector('.content-wrapper-stake-body-main-content-stat-title-content-each-value-price-yearly').textContent = "$" + (stakingValue * (currentChain.apr/100) * currentChain.price).toFixed(2);

}

window.addEventListener('load', () => {

  document.addEventListener('click', event => {
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
    }
  });
});
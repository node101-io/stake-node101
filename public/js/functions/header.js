function addChainToKeplr(currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const keplr = window.keplr;
  console.log("1212");
  console.log(currentChain);
  //const uri = 
  //https://rest.cosmos.directory/celestia/cosmos/bank/v1beta1/balances/celestia1xjf3jv3swc44ny4gy8pzhuy0nxslh0tnysyqn9
  //console.log(key);
  keplr.experimentalSuggestChain(currentChainInfo)
    .then(() => keplr.enable(currentChain.chain_id))
    .then(() => keplr.getKey(currentChain.chain_id))
    .then(key => {
      console.log("key", key.bech32Address);
      globalAddress = key.bech32Address;
      document.cookie = `currentChainKey=${currentChain.chain_id}`;
      document.cookie = `globalAddressKey=${globalAddress}`;
      getBalance(globalAddress, (err, balance) => {
        if (err)  console.log(err);
        console.log(balance);
        
        document.cookie = `globalBalanceKey=${balance}`;

       
      });
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
      // if (globalAddress) {
      //   return
      // }
      //document.querySelector('.content-wrapper-info').styles.display = 'none';
      //console.log(document.querySelector('.content-wrapper-portfolio-body'));
      //document.querySelector('.content-wrapper-portfolio-body').styles.display = 'block'; 

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
function addChainToKeplr(currentChain, callback) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const keplr = window.keplr;

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

     

      getValidatorList((err, data) => {
        if (err) console.log(err);
        console.log(currentChain);
      }); 
    
      getStake(globalAddress, currentChain.validator_address, (err, data) => {
        console.log(globalAddress);
        console.log(currentChain.validator_address);
        if (err) data = 0;
        
    
        let balance = document.querySelector('.content-wrapper-portfolio-body-stat-chain-value-amount-token').innerText;
        balance = parseFloat((balance.match(/\d+(\.\d+)?/) || [0])[0]) * 10 ** JSON.parse(currentChain.chain_info).currencies[0].coinDecimals;
        let width = (parseFloat(data)/(balance + parseFloat(data))) * 100;
        let width2 = 100 - width;
    
        if (balance == 0) {
          width = 0;
          width2 = 0;
        }
    
        document.querySelector('.content-wrapper-portfolio-body-stat-balance-statusbar-1').style.background = `linear-gradient(90deg, #CDEED3 ${width}%, #E4E9FF ${width}%)`;  
        document.querySelector('.content-wrapper-portfolio-body-stat-balance-statusbar-3').style.background = `linear-gradient(90deg, #FFD3D3 ${width2}%, #E4E9FF ${width2}%)`;
      });

      return callback(null);
      });
    });
};

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

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
  const tokenSymbol = document.querySelectorAll('.content-wrapper-stake-body-main-content-stat-title-content-each-value-token');
  const tokenApr = document.querySelectorAll('.content-wrapper-stake-body-main-content-stat-title-content-each-time-percent');
  const globalAddressElement = document.querySelector('.content-header-title-address');

  tokenApr[0].textContent = "+ " + (currentChain.apr / (365)).toFixed(2) + "%";
  tokenApr[1].textContent = "+ " + (currentChain.apr / (12)).toFixed(2) + "%";
  tokenApr[2].textContent = "+ " + (currentChain.apr).toFixed(2) + "%";

  globalAddressElement.innerHTML = getCookieValue('globalAddressKey').slice(0, 10) + "...";


  const tokenShow = document.querySelector('.content-wrapper-portfolio-body-stat-chain-name-token-name');
  const tokenShowImage = document.querySelector('.content-wrapper-portfolio-body-stat-chain-name-icon img');
  
  tokenShow.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom;

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


      currentChain = !currentChain ? JSON.parse(document.getElementById('chainInfoElement').value) : currentChain;

      if (!window.keplr) {
        alert("Keplr extension not installed");
        return;
      };
     
      addChainToKeplr(currentChain, (err) => {
        if (err) console.log(err);
      });
    }
  });
});
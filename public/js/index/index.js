let currentChain;
let globalAddress;
let globalBalance;

let carouselElement;
let carouselBall;
let counter = 0;

function carousel(isLeft) {
  const currentCounter = counter;

  if (isLeft) counter = counter - 1  < 0 ? carouselElement.length - counter - 1: counter - 1;
  else counter++;

  carouselElement[currentCounter % carouselElement.length].style.zIndex = 0;
  carouselElement[counter % carouselElement.length].style.zIndex = 500;

  carouselBall[currentCounter % carouselBall.length].style.backgroundColor = "#FFFFFF";
  carouselBall[counter % carouselBall.length].style.backgroundColor = "#C4CDF4";
};

window.addEventListener('load',  async() => {

  document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').focus();
  currentChain = JSON.parse(document.getElementById('chainInfoElement').value);
  globalAddress = document.getElementById('globalAddressElement')?.value || "";
  setTokenUI(JSON.parse(document.getElementById('chainInfoElement').value));

  
  carouselElement = Array.from(document.querySelectorAll('.content-wrapper-info-body-wrapper-each'));
  carouselBall = Array.from(document.querySelectorAll('.content-wrapper-info-footer-each'));
  console.log(carouselBall);

  setInterval(() => {
    carousel(false);
  }, 4000);

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
      const isLeft = true;
      carousel(isLeft);
    }


    if (event.target.closest('.content-wrapper-info-body-rarrow')) {
      const isLeft = false;
      carousel(isLeft);
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

        completeStake(offlineSigner, accounts[0], currentChain, stakingValue, (err, res) => {
          if (err) {
            console.log(err);
            return;
          };
        }
      );
      }).catch((err) => {
        console.log(err);
        return;
      });
    };
  })
});

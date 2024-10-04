window.addEventListener('load', () => {

  document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').focus();
  currentChain = JSON.parse(document.getElementById('chainInfoElement').value);
  globalAddress = document.getElementById('globalAddressElement')?.value || "";
  setTokenUI(JSON.parse(document.getElementById('chainInfoElement').value));

  document.addEventListener('input', event => {

    document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').focus();
    currentChain = JSON.parse(document.getElementById('chainInfoElement').value);
    globalAddress = document.getElementById('globalAddressElement')?.value || "";
    setTokenUI(JSON.parse(document.getElementById('chainInfoElement').value));
    
    if (event.target.closest('.content-wrapper-stake-body-main-center-body-stake-amount')) {
      const stakingValue = event.target.value;
      setAmountUI(stakingValue);
    }

    if (event.target.closest('.content-wrapper-stake-body-main-center-body-chain-list-search-input')) {
      const searchValue = event.target.value.toLowerCase();
      const chains = document.querySelectorAll('.content-wrapper-stake-body-main-center-body-chain-list-each');
      chains.forEach(chain => {
        if ((chain.getAttribute('data-chain-name')).includes(searchValue) || (chain.getAttribute('data-coin-name')).includes(searchValue))
          chain.style.display = '';
        else
          chain.style.display = 'none';
      });
    };
  });

  document.addEventListener('click', event => {


    if (event.target.closest('.content-wrapper-stake-body-main-center-title-each.content-wrapper-stake-body-main-center-title-half')) {
      const balance = document.querySelector('.content-wrapper-stake-body-main-center-title-amount').innerText;
      const stakeAmount = ((balance.match(/\d+(\.\d+)?/) || [0])[0])/2 > 0.02 ? ((balance.match(/\d+(\.\d+)?/) || [0])[0])/2 : 0;
      document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').value = stakeAmount;
      setAmountUI(stakeAmount);
    }

    if (event.target.closest('.content-wrapper-stake-body-main-center-title-each.content-wrapper-stake-body-main-center-title-max')) {
      const balance = document.querySelector('.content-wrapper-stake-body-main-center-title-amount').innerText;
      const stakeAmount = ((balance.match(/\d+(\.\d+)?/) || [0])[0]) > 0.02 ? ((balance.match(/\d+(\.\d+)?/) || [0])[0]) - 0.02 : 0;
      document.querySelector('.content-wrapper-stake-body-main-center-body-stake-amount').value = stakeAmount;
      setAmountUI(stakeAmount);
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
            if (err) console.log(err);

            setTokenUI(currentChain);
          });

        }
      });

      document.querySelector('.content-wrapper-stake-body-main-center-body-chain-list').classList.toggle('display-none');
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


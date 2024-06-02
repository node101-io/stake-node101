async function addChainToKeplr(currentChain) {
  try {

    // await keplr.experimentalSuggestChain(chains[chainName]);
    let currentChainInfo = JSON.parse(currentChain.chain_info);

    await keplr.enable(currentChain.chain_id);
    const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
    const accounts = (await offlineSigner.getAccounts())[0];
    const address = accounts.address;

    const signingClient = await SigningStargateClient.connectWithSigner(
      currentChain.rpc_url,
      offlineSigner
    );

    const coinMinimalDen = currentChainInfo.currencies[0].coinMinimalDenom;
    const myBalanc = (
      await signingClient.getBalance(address, coinMinimalDen)
    ).amount;

    walletAddValue.textContent = address.slice(0, 5) + "..." + (accounts.address).slice(-5);
    walletBalValue.textContent = myBalanc / 1000000 + " " + currentChainInfo.currencies[0].coinDenom

   
    
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}


window.addEventListener('load', async () => {

  const memo = "Use your power wisely";
  const chainInfoElement = document.getElementById('chainInfoElement');
  const validatorInfoElement = document.getElementById('validatorInfoElement');

  let currentChain = JSON.parse(chainInfoElement.value);
  const validatorAddress = validatorInfoElement.value;
  const modal = document.getElementById('tokenModal');


  // TODO: elementleri burada değişkene alma, click eventi dinleyip event tetikleindiğinde alırsın
;
  addChainToKeplr(currentChain);


  document.addEventListener('click', async event => {
    if (event.target.closest('.token-tile')) {
      serverRequest('/chain?chainid=celestia', 'GET', {}, (err, data) => {
        console.log(err, data);
        if (err) {
          console.log(err.message);
        } else {
          console.log("data", data);
          console.log(JSON.parse(chainInfoElement.textContent));
        }
      });

      const modal = document.getElementById('tokenModal');
      modal.style.display = 'none';
    }

    if (event.target.closest('.tokenWrapper')) {
      const modal = document.getElementById('tokenModal');
      modal.style.display = 'block';
    }

    if (event.target.closest('.tokenModal')) {
      console.log("yikeee")
      modal.style.display = "none";
    }

    if (event.target.closest('#connect')) {
      console.log("connect clicked");
      if (!keplr) {
        console.log("Keplr extension not installed");
        return;
      }

      addChainToKeplr(currentChainInfo);
    }

    if (event.target.closest('#stake')) {
      serverRequest('/chain?chainid=celestia', 'GET', {}, (err, data) => {
        console.log(err, data);
        if (err) {
          console.log(err.message);
        } else {
          data.test2
          console.log("data", data.test2);
          document.querySelector('gizlielement').value = JSON.stringify(data);
          console.log(JSON.parse(chainInfoElement.textContent));
        }
      });

      // const value = inputAmount.value;
      // const offlineSigner = keplr.getOfflineSigner(currentChainInfo.chainId);
      // const accounts = (await offlineSigner.getAccounts())[0];

      // // TODO: bunu bir fonksiyona çevir tabii ki callback ile
      // const msg = MsgDelegate.fromPartial({
      //   delegatorAddress: accounts.address,
      //   validatorAddress: validatorAddress,
      //   amount: {
      //     denom: currentChainInfo.currencies[0].coinMinimalDenom,
      //     amount: value
      //   },
      // });

      // const signingClient = await SigningStargateClient.connectWithSigner(
      //   currentChain.rpc,
      //   offlineSigner
      // );

      // const msgAny = {
      //   typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      //   value: msg,
      // };
      // const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;

      // const fee = {
      //   amount: [
      //     {
      //       denom: stakingdenom,
      //       amount: value,
      //     },
      //   ],
      //   gas: "980000", // 180k
      // };
      // const completeStaking = await signingClient.signAndBroadcast(
      //   accounts.address,
      //   [msgAny],
      //   fee,
      //   memo
      // );

      // console.log("Gas used: ", completeStaking);
      // console.log("codee", completeStaking.code)
      // if (completeStaking.code === 0) {
      //   alert("Transaction successful");
      // } else {
      //   alert("Transaction failed");
      // };
    };
  });
});

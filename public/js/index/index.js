async function addChainToKeplr(currentChain) {
  try {
   
    let currentChainInfo = JSON.parse(currentChain.chain_info);

    await keplr.experimentalSuggestChain(currentChainInfo);
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
    walletchainValue.textContent = currentChainInfo.chainName;
    walletTokenValue.textContent = currentChainInfo.currencies[0].coinDenom

   
    
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}


window.addEventListener('load', async () => {

  let currentChain;

  document.addEventListener('click', async event => {
    if (event.target.closest('.tokenWrapper')) {
      const modal = document.getElementById('tokenModal');
      modal.style.display = 'block';
    }

    if (event.target.closest('.token-tile')) {
      const tokenTile = event.target.closest('.token-tile');
      const inputElement = tokenTile.querySelector('#tokenId');
      const chain_id = inputElement.value;
      serverRequest(`/chain?chain_id=${chain_id}`, 'GET', {}, res => {
        if (res.error) {
          console.log(res);
        } else {
          
          currentChain = res.chainInfo;
          addChainToKeplr(currentChain);

          const tokenImage = document.getElementById('tokenImg');
          const tokenName = document.getElementById('tokenName');

          tokenImage.src = currentChain.img_url;
          tokenName.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom
        }
      });
      const modal = document.getElementById('tokenModal');
      modal.style.display = 'none';
    }
    
    if (event.target.closest('#connect')) {

      const chainInfoElement = document.getElementById('chainInfoElement');
      currentChain = !currentChain ? JSON.parse(chainInfoElement.value) : currentChain;
      
      if (!keplr) {
        console.log("Keplr extension not installed");
        return;
      }

      addChainToKeplr(currentChain);
    }

    if (event.target.closest('#stake')) {

      if (!currentChain) {
        console.log("Please connect to a chain");
        return;
      }
      
      let currentChainInfo = JSON.parse(currentChain.chain_info);
      const validatorAddress = currentChain.validator_address;

      const inputAmount = document.getElementById('amount');
      const value = inputAmount.value;

      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      const accounts = (await offlineSigner.getAccounts())[0];

      //  TODO: bunu bir fonksiyona çevir tabii ki callback ile

       const msg = MsgDelegate.fromPartial({
         delegatorAddress: accounts.address,
         validatorAddress: validatorAddress,
         amount: {
           denom: currentChainInfo.currencies[0].coinMinimalDenom,
           amount: value
         },
       });

       const signingClient = await SigningStargateClient.connectWithSigner(
         currentChain.rpc_url,
         offlineSigner
       );

       const msgAny = {
         typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
         value: msg,
       };
       const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;

       const fee = {
         amount: [
           {
             denom: stakingdenom,
             amount: value,
           },
         ],
         gas: "980000", // 180k
       };

       const memo = "Use your power wisely";

       const completeStaking = await signingClient.signAndBroadcast(
         accounts.address,
         [msgAny],
         fee,
         memo
       );

       console.log("Gas used: ", completeStaking);
       if (completeStaking.code === 0) {
         alert("Transaction successful");
       } else {
         alert("Transaction failed");
       };
    };
  });
});
async function addChainToKeplr(currentChain) { // TODO: callback
  try {

    // await keplr.experimentalSuggestChain(chains[chainName]);
    let currentChainInfo = JSON.parse(currentChain.chain_info); // TODO: jsonify.js under functions folder

    keplr.enable(currentChain.chain_id)
      .then( async (res) => {
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

        tokenImg.src = currentChainInfo.currencies[0].coinImageUrl;
        tokenNameX.textContent = currentChainInfo.currencies[0].coinMinimalDenom;
        tokenNameX.style.marginLeft = "15px"
        let listOfToken = document.getElementById('listofTokenElement');
        listOfToken = JSON.parse(listOfToken.value);
      });

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Unexpected error", err);
    }
  }
}

function closeModal() {
  const modal = document.getElementById('tokenModal');
  modal.style.display = 'none';
}


function showModal() {
  const modal = document.getElementById('tokenModal');
  modal.style.display = 'block';

  window.onclick = function (event) { // TODO: buna gerek yok document.click içinde dinliyoruz
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}




window.addEventListener('load', async () => {

  const memo = "Use your power wisely";
  let listOfToken= document.getElementById('listofTokenElement');
  listOfToken =  JSON.parse(listOfToken.value);
  const inputAmount = document.getElementById('amount');
  const chainInfoElement = document.getElementById('chainInfoElement');
  const validatorInfoElement = document.getElementById('validatorInfoElement');

  let currentChain = JSON.parse(chainInfoElement.value);
  const validatorAddress = validatorInfoElement.value;

  // TODO: elementleri burada değişkene alma, click eventi dinleyip event tetikleindiğinde alırsın
  const walletAdd = document.getElementById('walletAdd');
  const walletAddValue = document.getElementById('walletAddValue');
  const walletBal = document.getElementById('walletBal');
  const walletBalValue = document.getElementById('walletBalValue');
  const walletChain = document.getElementById('walletchain');
  const walletChainValue = document.getElementById('walletChainValue');
  const walletToken = document.getElementById('walletToken');
  const walletTokenValue = document.getElementById('walletTokenValue');
  const tokenImg = document.getElementById('tokenImg');
  const tokenNameX = document.getElementById('tokenName');
  const tokenWrapper = document.querySelector('.tokenWrapper');

  const connectButton = document.getElementById('connect');
  const stakeButton = document.getElementById('stake');

  const tokenListContainer = document.querySelector('.token-list');
  const tokenTile = document.createElement('div');
  tokenTile.classList.add('token-tile');


  addChainToKeplr(currentChain);

  Object.keys(listOfToken).forEach(tokenName => { // TODO: pugda yap buna gerek yok

    tokenTile.classList.add('token-tile');

    const img = document.createElement('img');
    img.classList.add('tokenimage')
    img.src = listOfToken[tokenName].imgUrl;
    img.alt = tokenName;
    img.width = 50;
    img.height = 50;

    const span = document.createElement('span');
    span.classList.add('token-name');
    span.textContent = tokenName;

    tokenTile.appendChild(img);
    tokenTile.appendChild(span);




    tokenListContainer.appendChild(tokenTile);
  });

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

      closeModal();
    }

    if (event.target.closest('.tokenWrapper')) {
      showModal();
    }

    if (event.target.closest('#connect')) {
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

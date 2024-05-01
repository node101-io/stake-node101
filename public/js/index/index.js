const listToken = [
  "cosmoshub",
  // "celestia",
  "agoric",
  // "irisnet",
  // "kyve",
  // "ux",
  // "assetmantle",
  // "desmos",
  // "emoney",
  // "crescent",
  // "oraichain",
  // "shentu",
  // "composable",
  // "bandchain",

  /*  "canto",
   "cheqd",
   "fxcore",
   "neutron",
   "stride" */

];

let chainName = "cosmoshub";
console.log(listToken)

window.addEventListener('load', async () => {
  const keplr = window.keplr;

  const inputAmount = document.getElementById('amount');
  const walletAdd = document.getElementById('walletAdd');
  const walletBal = document.getElementById('walletBal');
  const walletChain = document.getElementById('walletchain');
  const walletToken = document.getElementById('walletToken');

  const tokenImg = document.getElementById('tokenImg');
  const tokenNameX = document.getElementById('tokenName');
  const tokenWrapper = document.querySelector('.tokenWrapper');

  const connectButton = document.getElementById('connect');
  const stakeButton = document.getElementById('stake');


  console.log("chainName", chainName)
  const chainRealName = chains[chainName].chainName;
  const chainId = chains[chainName].chainId;
  const rpcUrl = chains[chainName].rpc;
  const currency = chains[chainName].currencies[0].coinDenom;
  const coinMinimalDenom = chains[chainName].currencies[0].coinMinimalDenom;

  const memo = "Use your power wisely";

  console.log("img src", chains[chainName].currencies[0].coinImageUrl)
  tokenImg.src = chains[chainName].currencies[0].coinImageUrl;
  tokenNameX.textContent = chains[chainName].currencies[0].coinDenom;
  // make the text align center
  tokenNameX.style.marginLeft = "15px"


  const offlineSigner = keplr.getOfflineSigner(chainId);
  const accounts = (await offlineSigner.getAccounts())[0];
  const address = accounts.address;
  const signingClient = await SigningStargateClient.connectWithSigner(
    rpcUrl,
    offlineSigner
  );

  const myBalance = (
    await signingClient.getBalance(address, coinMinimalDenom)
  ).amount;

  console.log("chainId7", chainId)
  setTextContent(walletAdd, "Address" + ": " + address.slice(0, 5) + "..." + (accounts.address).slice(-5));
  setTextContent(walletBal, "Balance: " + myBalance / 1000000 + " " + currency);
  setTextContent(walletChain, "Chain: " + chainRealName);
  setTextContent(walletToken, "Token: " + currency);


  const tokenListContainer = document.querySelector('.token-list');

  // Populate the token list dynamically
  listToken.forEach(tokenName => {
    const tokenTile = document.createElement('div');
    tokenTile.classList.add('token-tile');

    const img = document.createElement('img');
    img.classList.add('tokenimage')
    img.src = chains[tokenName].currencies[0].coinImageUrl; // Replace with the actual path to your token images
    img.alt = tokenName;
    img.width = 50;
    img.height = 50;

    const span = document.createElement('span');
    span.classList.add('token-name');
    span.textContent = tokenName;

    tokenTile.appendChild(img);
    tokenTile.appendChild(span);

    tokenTile.addEventListener('click', async () => {
      // Update the chain name when a token is clicked
      chainName = tokenName;
      const img = document.getElementById('tokenImg');
      console.log("Ne oluyor", chains[chainName].currencies[0].coinImageUrl)
      img.src = chains[chainName].currencies[0].coinImageUrl; // Replace with the actual path to your token images
      img.alt = chainName;
      tokenNameX.textContent = chains[chainName].currencies[0].coinDenom;



      console.log("changed")
      try {
        await keplr.experimentalSuggestChain(chains[chainName]);
        console.log("sleep", chains[chainName].chainId)
        await keplr.enable(chains[chainName].chainId);

        const offlineSigner = keplr.getOfflineSigner(chains[chainName].chainId);
        const accounts = (await offlineSigner.getAccounts())[0];
        const address = accounts.address;
        const signingClient = await SigningStargateClient.connectWithSigner(
          chains[chainName].rpc,
          offlineSigner
        );

        const myBalance = (
          await signingClient.getBalance(address, coinMinimalDenom)
        ).amount;

        console.log("chainId7", chains[chainName].chainId)
        setTextContent(walletAdd, "Address" + ": " + address.slice(0, 5) + "..." + (accounts.address).slice(-5));
        setTextContent(walletBal, "Balance: " + myBalance / 1000000 + " " + chains[chainName].currencies[0].coinDenom);
        setTextContent(walletChain, "Chain: " + chains[chainName].chainName);
        setTextContent(walletToken, "Token: " + chains[chainName].currencies[0].coinDenom);

      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Unexpected error", err);
        }
      }

      // Update other elements accordingly
      // Hide the modal after selecting a token
      closeModal();

    });

    tokenListContainer.appendChild(tokenTile);
  });



  function closeModal() {
    const modal = document.getElementById('tokenModal');
    modal.style.display = 'none';
  }

  function setTextContent(elementId, text) {
    elementId.textContent = text;
  }

  function showModal() {
    const modal = document.getElementById('tokenModal');
    modal.style.display = 'block';

    // Close the modal when clicking outside of it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  tokenWrapper.addEventListener('click', () => {
    // Show the modal pop-up
    showModal();
  });

  connectButton.addEventListener("click", async () => {

    console.log("Yaay")
    if (!keplr) {
      console.log("Keplr extension not installed");
      return;
    }

    try {
      await keplr.experimentalSuggestChain(chains[chainName]);
      await keplr.enable(chainId);

      const offlineSigner = keplr.getOfflineSigner(chainId);
      const accounts = (await offlineSigner.getAccounts())[0];
      const address = accounts.address;
      const signingClient = await SigningStargateClient.connectWithSigner(
        rpcUrl,
        offlineSigner
      );

      const myBalance = (
        await signingClient.getBalance(address, coinMinimalDenom)
      ).amount;

      setTextContent(walletAdd, "Address" + ": " + address.slice(0, 5) + "..." + (accounts.address).slice(-5));
      setTextContent(walletBal, "Balance: " + myBalance / 1000000 + " " + currency);
      setTextContent(walletChain, "Chain: " + chainRealName);
      setTextContent(walletToken, "Token: " + currency);





    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Unexpected error", err);
      }
    }
  });

  stakeButton.addEventListener("click", async () => {
    console.log("Hello delegate!")
    const value = inputAmount.value

      ;
    const offlineSigner = keplr.getOfflineSigner(chains[chainName].chainId);
    const accounts = (await offlineSigner.getAccounts())[0];
    const address = accounts.address;

    console.log(chains[chainName].validator_address)

    const msg = MsgDelegate.fromPartial({
      delegatorAddress: address, //01node
      validatorAddress: chains[chainName].validator_address,
      amount: { denom: chains[chainName].currencies[0].coinMinimalDenom, amount: value },
    });
    console.log("msg", msg)

    const signingClient = await SigningStargateClient.connectWithSigner(
      chains[chainName].rpc,
      offlineSigner
    );

    const msgAny = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: msg,
    };
    const fee = {
      amount: [
        {
          denom: chains[chainName].currencies[0].coinMinimalDenom,
          amount: value,
        },
      ],
      gas: "980000", // 180k
    };
    console.log(msgAny)
    const gasUsed = await signingClient.signAndBroadcast(
      address,
      [msgAny],
      fee,
      memo
    );
    console.log("Gas used: ", gasUsed);
    console.log("codee", gasUsed.code)
    if (gasUsed.code === 0) {
      alert("Transaction successful");
    } else {
      alert("Transaction failed");
    }
  }
  );
});

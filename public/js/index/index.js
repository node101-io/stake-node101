
const listToken =  [
  "cosmoshub",
  "agoric",
] // TODO: bundan kurtul

let chainName  = "cosmoshub";
let currentChainInfo = "";
const memo = "Use your power wisely";

function getChain(chain_id, chain_name){
  const response = fetch(`/chain/${chain_id}`) // TODO: fetch yerine serverRequest kullan
    .then(res => res.json())
    .then(res => {
      const rpc_url = res.rpc_url;
      const validator_address = res.validator_address;
      const chain_info = JSON.parse(res.chain_info);

      chain_info.rpc = `https://rpc.cosmos.directory/${chain_name}`;
      chain_info.validatorAddress = validator_address;
      console.log(chain_info);
      currentChainInfo = chain_info;
    });
};

window.addEventListener('load', async () => {
  getChain("cosmoshub-4", "cosmoshub");
  const inputAmount = document.getElementById('amount');
  const walletAdd = document.getElementById('walletAdd');
  const walletBal = document.getElementById('walletBal');
  const walletChain = document.getElementById('walletchain');
  const walletToken = document.getElementById('walletToken');

  const tokenImg = document.getElementById('tokenImg');
  const tokenNameX = document.getElementById('tokenName');
  const tokenWrapper = document.querySelector('.tokenWrapper');

  const connectButton = document.getElementById('connect');
  connectButton.style.backgroundColor = "#fff";
  const stakeButton = document.getElementById('stake');
  const keplr = window.keplr;

  function setDashboard(address, myBalance){
    setTextContent(walletAdd, "Address" +": "+ address.slice(0, 5) + "..." + (address).slice(-5));
    setTextContent(walletBal,"Balance: " +  myBalance/1000000 + " " + currentChainInfo.currencies[0].coinDenom);
    setTextContent(walletChain, "Chain: " + currentChainInfo.chainName);
    setTextContent(walletToken, "Token: " + currentChainInfo.currencies[0].coinDenom);
}
  tokenImg.src = chains[chainName].currencies[0].coinImageUrl;
  tokenNameX.textContent = chains[chainName].currencies[0].coinDenom;
  tokenNameX.style.marginLeft = "15px"


  const tokenListContainer = document.querySelector('.token-list');

  listToken.forEach(tokenName => {
      const tokenTile = document.createElement('div');
      tokenTile.classList.add('token-tile');

      const img = document.createElement('img');
      img.classList.add('tokenimage')
      img.src =  chains[tokenName].currencies[0].coinImageUrl ; // Replace with the actual path to your token images
      img.alt = tokenName;
      img.width = 50;
      img.height = 50;

      const span = document.createElement('span');
      span.classList.add('token-name');
      span.textContent = tokenName;

      tokenTile.appendChild(img);
      tokenTile.appendChild(span);

      tokenTile.addEventListener('click', async () => {
        chainName = tokenName;
        const img = document.getElementById('tokenImg');
        img.src =  chains[chainName].currencies[0].coinImageUrl ; // Replace with the actual path to your token images
        img.alt = chainName;
        tokenNameX.textContent = chains[chainName].currencies[0].coinDenom;



        try {

          await keplr.experimentalSuggestChain(chains[chainName]);
          await keplr.enable(chains[chainName].chainId);

          const offlineSigner = keplr.getOfflineSigner(chains[chainName].chainId);
          const accounts = (await offlineSigner.getAccounts())[0];
          const address = accounts.address;
          console.log(address)

          const signingClient = await SigningStargateClient.connectWithSigner(
                  chains[chainName].rpc,
                  offlineSigner
          );
          const coinMinimalDen = chains[chainName].currencies[0].coinMinimalDenom;
          console.log("coinMinimalDen",coinMinimalDen)
          const myBalanc = (
            await signingClient.getBalance(address, coinMinimalDen)
          ).amount;



        setDashboard(address, myBalanc, chains[chainName].chainName, chains[chainName].currencies[0].coinDenom, chains[chainName].currencies[0].coinImageUrl);
        } catch (err) {
          if (err instanceof Error) {
            console.log(err.message);
          } else {
            console.log("Unexpected error", err);
          }
        }

        closeModal();

    });

      tokenListContainer.appendChild(tokenTile);
  });



function closeModal() {
    const modal = document.getElementById('tokenModal');
    modal.style.display = 'none';
}



  function showModal() {
    const modal = document.getElementById('tokenModal');
    modal.style.display = 'block';

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }

    /*   tokenWrapper.addEventListener('click', () => {
        showModal();
      }); */

  connectButton.addEventListener("click", async () => {
    getChain("cosmoshub-4", "cosmoshub");
    if (!keplr) {
      console.log("Keplr extension not installed");
      return;
    }

    try {
     // await window.keplr.experimentalSuggestChain(currentChainInfo);
      await keplr.enable(currentChainInfo.chainId);
      const offlineSigner = keplr.getOfflineSigner(currentChainInfo.chainId);
      const accounts = (await offlineSigner.getAccounts())[0];
      const address = accounts.address;
      const signingClient = await SigningStargateClient.connectWithSigner(
        currentChainInfo.rpc,
        offlineSigner
      );

    const myBalance = (
    await signingClient.getBalance(address, currentChainInfo.currencies[0].coinMinimalDenom)
    ).amount;
    setDashboard(address, myBalance, currentChainInfo.chainName, currentChainInfo.currencies[0].coinDenom, currentChainInfo.currencies[0].coinImageUrl);


    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("Unexpected error", err);
      }
    }
  });

  stakeButton.addEventListener("click", async () => {
    const value = inputAmount.value;
    const offlineSigner = keplr.getOfflineSigner(currentChainInfo.chainId);
    const accounts = (await offlineSigner.getAccounts())[0];


    const msg = MsgDelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: currentChainInfo.validatorAddress,
      amount: {
        denom: currentChainInfo.currencies[0].coinMinimalDenom,
        amount: value
      },
    });

   const signingClient = await SigningStargateClient.connectWithSigner(
    currentChainInfo.rpc,
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
  const gasUsed = await signingClient.signAndBroadcast(
    accounts.address,
    [msgAny],
    fee,
    memo
  );

    function sendStakeTransaction(data) {
      data.address

      // TODO: burayı biraz dene kurcala
    };
  console.log("Gas used: ", gasUsed);
  console.log("codee", gasUsed.code)
  if (gasUsed.code === 0) {
    alert("Transaction successful");
  } else  {
    alert("Transaction failed");
  }}
  );

  // TODO: document.addEventListener('click', () => { ... }) kullan
});

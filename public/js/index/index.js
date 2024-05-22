listOfToken = {
  "cosmoshub": {
    "chainId": "cosmoshub-4",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/chain.png",
  },
  "agoric": {
    "chainId": "agoric-3",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/chain.png",
  },
  "celestia": {
    "chainId": "celestia",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/celestia/chain.png",
  },/* 
  "laozi-mainnet": {
    "chainId": "laozi-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/laozi-mainnet/chain.png",
  },
  "canto": {
    "chainId": "canto_7700",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/canto_7700/chain.png",
  },
  "shentu": {
    "chainId": "shentu-2.2",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/shentu-2.2/chain.png",
  },
  "irisnet": {
    "chainId": "irishub",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/irishub/chain.png",
  },
  "cheqd": {
    "chainId": "cheqd-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cheqd-mainnet/chain.png",
  },
  "composable": {
    "chainId": "centauri",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/centauri/chain.png",
  },
  "kyve": {
    "chainId": "kyve",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/kyve/chain.png",
  },
  "umee": {
    "chainId": "umee",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/umee/chain.png",
  },
  "assetmantle": {
    "chainId": "mantle",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/mantle/chain.png",
  },
  "desmos": {
    "chainId": "desmos-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/desmos-mainnet/chain.png",
  },
  "emoney": {
    "chainId": "emoney",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/emoney/chain.png",
  }, */
};

  


let currentChainInfo = "";
const memo = "Use your power wisely";

window.addEventListener('load', async () => {
    const inputAmount = document.getElementById('amount');
    const chainInfoElement = document.getElementById('chainInfoElement');
    const validatorInfoElement = document.getElementById('validatorInfoElement');


    currentChainInfo = JSON.parse(chainInfoElement.textContent);
    const validatorAddress = validatorInfoElement.textContent
  

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
    connectButton.style.backgroundColor = "#fff";
    const stakeButton = document.getElementById('stake');
    const keplr = window.keplr;

 

    tokenImg.src = currentChainInfo.currencies[0].coinImageUrl;
    tokenNameX.textContent = currentChainInfo.currencies[0].coinDenom;
    tokenNameX.style.marginLeft = "15px"


    const tokenListContainer = document.querySelector('.token-list');

  
    try {

         // await keplr.experimentalSuggestChain(chains[chainName]);
          await keplr.enable(currentChainInfo.chainId);
          const offlineSigner = keplr.getOfflineSigner(currentChainInfo.chainId);
          const accounts = (await offlineSigner.getAccounts())[0];
          const address = accounts.address;

          const signingClient = await SigningStargateClient.connectWithSigner(
                  currentChainInfo.rpc,
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

     Object.keys(listOfToken).forEach(tokenName => {

      const tokenTile = document.createElement('div');
      tokenTile.classList.add('token-tile');

      const img = document.createElement('img');
      img.classList.add('tokenimage')
      img.src =  listOfToken[tokenName].imgUrl;
      img.alt = tokenName;
      img.width = 50;
      img.height = 50;

      const span = document.createElement('span');
      span.classList.add('token-name');
      span.textContent = tokenName;

      tokenTile.appendChild(img);
      tokenTile.appendChild(span);

      tokenTile.addEventListener('click', async () => {
            window.location.href = `/chain?chainId=${listOfToken[tokenName].chainId}`;
      });
       //   closeModal();

    

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

       tokenWrapper.addEventListener('click', () => {
        showModal();
      }); 

  connectButton.addEventListener("click", async () => {
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
    walletAddValue.textContent = address.slice(0, 5) + "..." + (accounts.address).slice(-5);
    walletBalValue.textContent = myBalance / 1000000 + " " + currentChainInfo.currencies[0].coinDenom


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
      validatorAddress: validatorAddress,
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

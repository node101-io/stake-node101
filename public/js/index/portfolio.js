let globalOfflineSigner;
let globalAddress;
let currentChain; 


function getReward(delegatorAddressx, validatorAddressx, callback) {
  //const currentChainInfo = JSON.parse(currentChain.chain_info);

  const stakingdenom = 'uatom';// currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const rpcEndpointx = currentChain.rpc_url;
  Tendermint34Client.connect(rpcEndpointx).then((tendermintClient) => {

    const queryClient = QueryClient.withExtensions(tendermintClient, setupDistributionExtension);

    queryClient.distribution.delegationRewards(delegatorAddressx, validatorAddressx).then((rewardsResponse) => {
      const rewards = rewardsResponse.rewards;
      let amountx;
      const uatomRewards = rewards.filter(reward => reward.denom === stakingdenom);
      uatomRewards.forEach(reward => {
        amountx = Math.floor(parseFloat(reward.amount) / 10e17);
        console.log("reward", reward.amount);
        console.log("Amount", amountx);
        return callback(null, `${amountx}`);
      });
    });
  }
  ).catch(_ => {
    return callback('document_not_found');
  });
}


function completeStaking(offlineSigner, accounts, currentChain, stakingValue) {
      const currentChainInfo = JSON.parse(currentChain.chain_info);
      const validatorAddress = currentChain.validator_address
      const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
      stakingValue = parseFloat(stakingValue) * (10 ** currentChainInfo.currencies[0].coinDecimals);
      const memo = "Use your power wisely";
      console.log("Max val", stakingValue);
  
      const DelegateMsg = MsgDelegate.fromPartial({
         delegatorAddress: accounts.address,
         validatorAddress: validatorAddress,
         amount: {
           denom: stakingdenom,
           amount: stakingValue.toString()
         }
       });

      const DelegateTransaction = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: DelegateMsg,
      };

      const fee = {
        amount: [
          {
            denom: stakingdenom,
            amount: stakingValue,
          },
        ],
        gas: "950000", //950k 
      };

      SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
      .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [DelegateTransaction],fee,memo))
      .then((gasUsed) => {
        console.log("Gas used: ", gasUsed);
    console.log("codee", gasUsed.code) 
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }
  
    console.log("Gas used: ", gasUsed);
      })
      .catch((err) => {
        console.log(err);
      });
}; 



function completeRedelgation(offlineSigner, accounts, currentChain, validatorAddress) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "Use your power wisely";

  const RedelegateMsg = 
    MsgBeginRedelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorSrcAddress: validatorAddress,
      validatorDstAddress: currentChain.validator_address,
    amount: {
      denom: stakingdenom,
      amount: "10"
    }
  })



  const RedelegateTransaction = {
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    value: RedelegateMsg,
  };

  const fee = {
    amount: [
      {
        denom: stakingdenom,
        amount: 10,
      },
    ],
    gas: "1200000", //950k 
  };

  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
      .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [RedelegateTransaction],fee,memo))
      .then((gasUsed) => {
        console.log("Gas used: ", gasUsed);
    console.log("codee", gasUsed.code) 
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }

    console.log("Gas used: ", gasUsed);
      })
      .catch((err) => {
        console.log(err);
      });
}; 


function completeUnstake(offlineSigner, accounts, currentChain) {
  const currentChainInfo = JSON.parse(currentChain.chain_info);
  const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
  const memo = "Use your power wisely";
  const validatorAddress = currentChain.validator_address;

  getReward(accounts.address, (err, data) => {
  console.log("Data", data);
  const UndelegateMsg = 
    MsgUndelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress,
      amount: {
        denom: stakingdenom,
        amount: data
      }
  })



  const UndelegateTransaction = {
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
    value: UndelegateMsg,
  };

  const fee = {
    amount: [
      {
        denom: stakingdenom,
        amount: data,
      },
    ],
    gas: "1200000", //950k 
  };

  SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
      .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [UndelegateTransaction],fee,memo))
      .then((gasUsed) => {
        console.log("Gas used: ", gasUsed);
    console.log("codee", gasUsed.code) 
    if (gasUsed.code === 0) {
      alert("Transaction successful");
      console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
    } else  {
      alert("Transaction failed");
    }

    console.log("Gas used: ", gasUsed);
      })
      .catch((err) => {
        console.log(err);
      });
}
  )};
  

function completeRestake(offlineSigner, accounts, currentChain) {
    const currentChainInfo = JSON.parse(currentChain.chain_info);
    const stakingdenom = currentChainInfo.feeCurrencies[0].coinMinimalDenom;
    const memo = "Use your power wisely";
    const validatorAddress = currentChain.validator_address;
  
    getReward(accounts.address, (err, data) => {
    console.log("Data", data);
    const UndelegateMsg = 
      MsgUndelegate.fromPartial({
        delegatorAddress: accounts.address,
        validatorAddress: validatorAddress,
        amount: {
          denom: stakingdenom,
          amount: data
        }
    })
  
  
  
    const UndelegateTransaction = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: UndelegateMsg,
    };
  

    const DelegateMsg = MsgDelegate.fromPartial({
      delegatorAddress: accounts.address,
      validatorAddress: validatorAddress,
      amount: {
        denom: stakingdenom,
        amount: data
      }
    });

   const DelegateTransaction = {
     typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
     value: DelegateMsg,
   };

   const fee = {
     amount: [
       {
         denom: stakingdenom,
         amount: data,
       },
     ],
     gas: "950000", //950k 
   };
   console.log("Data", [UndelegateTransaction, DelegateTransaction]);
    SigningStargateClient.connectWithSigner(currentChain.rpc_url,offlineSigner)
        .then((signingClient)=> signingClient.signAndBroadcast(accounts.address, [UndelegateTransaction, DelegateTransaction],fee,memo))
        .then((gasUsed) => {
          console.log("Gas used: ", gasUsed);
      console.log("codee", gasUsed.code) 
      if (gasUsed.code === 0) {
        alert("Transaction successful");
        console.log(`https://www.mintscan.io/cosmos/tx/${gasUsed.transactionHash}`);
      } else  {
        alert("Transaction failed");
      }
  
      console.log("Gas used: ", gasUsed);
        })
        .catch((err) => {
          console.log(err);
        });
  }
  )};



function addChainToKeplr(currentChain, callback) {
 
  const keplr = window.keplr;
  const currentChainInfo = JSON.parse(currentChain.chain_info);

  keplr.experimentalSuggestChain(currentChainInfo)
    .then(() => keplr.enable(currentChain.chain_id))
    .then(() => keplr.getOfflineSigner(currentChain.chain_id))
    .then((offlineSigner) => {
      globalOfflineSigner = offlineSigner;
      return offlineSigner.getAccounts();
    })
    .then((accounts) => {
      globalAddress = accounts[0].address;
      return SigningStargateClient.connectWithSigner(currentChain.rpc_url, globalOfflineSigner);
    })
    .then((signingClient) => {
      return signingClient.getBalance(globalAddress, currentChainInfo.currencies[0].coinMinimalDenom)
})
    .then((balance) => {
      console.log("Balance", balance.amount);
      document.querySelector('.content-header-title').textContent = globalAddress.slice(0, 10) + "...";
      document.querySelector('.content-wrapper-stake-body-main-center-title-amount').textContent = Math.round(((100 * balance.amount) / (10 ** currentChainInfo.currencies[0].coinDecimals)) )/100 + " " + currentChainInfo.currencies[0].coinDenom;
      return callback(null);s
    }).catch((err) => {
      return callback(err);
  });
};



function setTokenUI(currentChain) {
  const tokenImage = document.querySelector('.content-wrapper-stake-body-main-center-body-icon-img');
  const tokenName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-token');
  const chainName = document.querySelector('.content-wrapper-stake-body-main-center-body-chain-name-network');

  tokenImage.src = currentChain.img_url;
  tokenName.textContent = JSON.parse(currentChain.chain_info).currencies[0].coinDenom
  chainName.textContent = JSON.parse(currentChain.chain_info).chainName;
};

const SLIDE_ANIMATION_INTERVAL = 14;
const SLIDE_ANIMATION_STEP = 1;

let boxPadding = null;
let activeProject = null;
let activeProjectToLeft = 0;

function removeProject(element) {
  const newElement = element.cloneNode(true);
  element.remove();
  newElement.style.marginLeft = `${boxPadding}px`;
  document.querySelector('.content-wrapper-stake-body-main-title').appendChild(newElement);
};

function projectsSlideAnimation() {
  if (activeProjectToLeft > activeProject.getBoundingClientRect().width + boxPadding * 2) {
    activeProjectToLeft = 0;
    removeProject(activeProject);
    activeProject = document.querySelector('.content-wrapper-stake-body-main-title').childNodes[0];
    activeProject.style.marginLeft = `0`;
  } else {
    activeProjectToLeft += SLIDE_ANIMATION_STEP;
    activeProject.style.marginLeft = `-${activeProjectToLeft}px`;
  }
  setTimeout(() => {
    projectsSlideAnimation();
  }, SLIDE_ANIMATION_INTERVAL)
};


let counter = 1;
let elx ;
let children ;

let classNames;

function carosoul(step="right") {

  if (step == "left") {
    counter -= 3;
  }


  classNames[(counter - 1) %(classNames.length)].style.zIndex = 0;
  classNames[counter  % (classNames.length)].style.zIndex = 500;

 /*  classNames[1].style.zIndex = '100';
  console.log(classNames[counter%(classNames.length)]) */
  counter++;
  

  setTimeout(() => {
    carosoul();
  }, 2000);

};


window.addEventListener('load',  () => {
  //carosoul();
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
      console.log("here");
      const stakingValue = event.target.value;
      const stakingAmount = document.querySelector('.content-wrapper-stake-body-main-center-body-stake-dollar');
      stakingAmount.textContent = "$"+ Math.round(100 * stakingValue *  currentChain.price)/100;
    }
  });
  document.addEventListener('click', event => {



    if (event.target.closest('.redelegate-content-wrapper-stake-body-main-center-body-chain-list')) {
      const popup = document.querySelector('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-tile-wrapper');
      popup.classList.toggle('display-none');
    }

    if (event.target.closest('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-tile')) {
      const popup = document.querySelector('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-tile-wrapper');
      popup.classList.toggle('display-none');
    }

    if (event.target.closest('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-tile')) {
      console.log("here");
      const operatorAddress = event.target.closest('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-tile').querySelector('.redelegate-content-wrapper-stake-body-main-center-body-chain-list-each-token').textContent;
      
      getReward(globalAddress,operatorAddress, (err, data) => { 
        if (err) console.log(err);
        

       document.querySelector('.redelegate-content-wrapper-stake-body-main-center-title-amount').textContent = `${data / 10 ** JSON.parse(currentChain.chain_info).currencies[0].coinDecimals}` + " " + `${JSON.parse(currentChain.chain_info).currencies[0].coinDenom}`;
      });
    };

    if(event.target.closest('.content-wrapper-portfolio-body-buttons-each-collect')) {
      console.log("XYZ");
       if (!window.keplr) {
        console.log("Keplr extension not installed");
        return;
      };
      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().
      then((accounts) => {
        completeUnstake(offlineSigner, accounts[0], currentChain);
      
      }).catch((err) => {
        console.log(err);
        return;
      }); 
    }; 

    if(event.target.closest('.content-wrapper-portfolio-body-buttons-each-restake')) {
      const dx = document.querySelector('.content-wrapper-portfolio-body-buttons-each-restake');
      dx.style.border = "10px solid red";
      console.log("123XYZ");
       if (!window.keplr) {
        console.log("Keplr extension not installed");
        return;
      };
      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().
      then((accounts) => {
        completeRestake(offlineSigner, accounts[0], currentChain);
      
      }).catch((err) => {
        console.log(err);
        return;
      }); 
    }; 

    if (event.target.closest('.content-wrapper-portfolio-body-validators-content-first')) {

      const validatorAddress = document.querySelector('.content-wrapper-portfolio-body-validators-content-first')
      const validatorAddress1 = validatorAddress.querySelector('#content-wrapper-portfolio-body-validators-content-first-address').value;
      console.log(validatorAddress1);
      if (!window.keplr) {
        console.log("Keplr extension not installed");
        return;
      };
      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().
      then((accounts) => {
        
        completeRedelgation(offlineSigner, accounts[0], currentChain, validatorAddress1)
      
      }).catch((err) => {
        console.log(err);
        return;
      });
    }; 
  
    if (event.target.closest('.redelegate-wrapper-title-icon')) {
      document.querySelector('.redelegate-wrapper').classList.toggle('display-none');
    }


    if (event.target.closest('.content-wrapper-portfolio-body-validators-content-third')) { 
      console.log("here");
      const redelegateWrapper = document.querySelector('.redelegate-wrapper');
      redelegateWrapper.classList.toggle('display-none');

   /*    const validatorAddress = event.target.closest('.content-wrapper-portfolio-body-validators-content-third').querySelector('.content-wrapper-portfolio-body-validators-content-third-address').textContent;
      console.log(validatorAddress);
      if (!window.keplr) {
        console.log("Keplr extension not installed");
        return;
      };
      console.log("Adding chain");
      addChainToKeplr(currentChain, (err) => {
        if (err) console.log(err);
      }); */
    }

    if (event.target.closest('.content-wrapper-info-body-larrow')) {
      
      carosoul("left");
      console.log("yy")
    }


    if (event.target.closest('.content-wrapper-info-body-rarrow')) {
      carosoul();
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

          addChainToKeplr(currentChain);
          setTokenUI(currentChain);
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
      console.log(stakingValue);
      const offlineSigner = keplr.getOfflineSigner(currentChain.chain_id);
      offlineSigner.getAccounts().
      then((accounts) => {
        completeStaking(offlineSigner, accounts[0], currentChain, stakingValue); 
      }).catch((err) => {
        console.log(err);
        return;
      });
    }; 
  })
});
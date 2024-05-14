const { Cron } = require('croner');

const getFromGithub = require('../models/ChainInfo/functions/getGithubData');
const { getRpcUrl, CheckRpcUrl } = require('../models/ChainInfo/functions/getRpcUrl');
const ChainInfo = require('../models/ChainInfo/ChainInfo');


class ChainInfoClass {
  constructor(chainName, chainId,KeplrName, chainRegistry,chainRegistryGithub, validator_address=""){
    this.chainName = chainName;
    this.chainId = chainId;
    this.chainRegistry = chainRegistry;
    this.chainRegistryGithub = chainRegistryGithub;
  }
}

const ChainsToStake = [
  new ChainInfoClass(
    "cosmoshub",
    "cosmoshub-4",
    "cosmoshub",
    "cosmoshub",
    "cosmoshub"
  ),
  new ChainInfoClass(
    "agoric",
    "agoric-3",
    "agoric",
    "agoric"
  ),
  new ChainInfoClass(
    "celestia",
    "celestia",
    "celestia",
    "celestia",
    "celestia"
  ),
   new ChainInfoClass(
    "laozi-mainnet",
    "laozi-mainnet",
    "bandchain",
    "bandchain"
  ),
  /*
  new ChainInfoClass(
    "canto_7700",
    "canto_7700-1",
    "canto",
    "canto"
  ),
  new ChainInfoClass(
    "shentu-2.2",
    "shentu-2.2",
    "shentu",
    "shentu"
  ),
  new ChainInfoClass(
    "irishub",
    "irishub-1",
    "irisnet",
    "irisnet"
  ),
  new ChainInfoClass(
    "cheqd-mainnet",
    "cheqd-mainnet-1",
    "cheqd",
    "cheqd"
  ),
  new ChainInfoClass(
    "centauri",
    "centauri-1",
    "composable",
    "composable"
  ),
  new ChainInfoClass(
    "kyve",
    "kyve-1",
    "kyve",
    "kyve"
  ),
  new ChainInfoClass(
    "umee",
    "umee-1",
    "umee",
    "umee"
  ),  
  new ChainInfoClass(
    "assetmantle",
    "mantle",
    "assetmantle",
    "assetmantle"
  ),
  new ChainInfoClass(
    "desmos",
    "desmos-mainnet",
    "desmos",
    "desmos"
  ),
  new ChainInfoClass(
    "emoney",
    "emoney",
    "emoney",
    "emoney"
  ) */
]

/*   "cosmoshub": "cosmoshub-4", //Not ok
  "celestia": "celestia",
  "laozi-mainnet" : "laozi-mainnet",
  "canto_7700" : "canto_7700-1",
  "shentu-2.2": "shentu-2.2",
  "agoric": "agoric-3",
  "irishub" : "irishub-1",
  "cheqd-mainnet" : "cheqd-mainnet-1",
  "centauri": "centauri-1",
  "kyve" : "kyve-1",
  "umee" : "umee-1",
  "assetmantle": "mantle",
  "desmos": "desmos-mainnet",
  "emoney": "emoney",
  //"kichain": "kichain-2", */




const chainInfoIds = [
  'cosmoshub',
  'agoric',
  'celestia',
];

const Job = {
  start: () => {
    Cron('*/5 * * * * *', () => {
      for (const chains of ChainsToStake) {
        getFromGithub(chains.chainName, (err, chainInfores) => {
          if (err)
            return console.error(err);

          if (!chainInfores)
            return console.error('bad_request');
          let rpcUrltry = "";
          let rpcUrlLink =  `https://rpc.cosmos.directory/${chains.chainRegistry}`
          CheckRpcUrl(rpcUrlLink, (err, res) => {
            if (err || !res){
                getRpcUrl(chains.chainRegistry, (err, responseList) => {
                  if (err){
                    return console.error(err)
                  }
                  rpcUrltry = responseList[0];
                  ChainInfo.findChainInfoByIdAndUpdate(chains.chainId, {
                    chain_id: chains.chainId, 
                    rpc_url: rpcUrltry, 
                    chain_info: JSON.stringify(chainInfores),
                    is_active: true
                  }, (err, chainInfores) => {
                    if (err)
                      return console.error(err);
      
                  });
           /*        for (rpcResponse of responseList){
                    console.log("2Stratiiiing")
                    if (rpcUrltry != ""){
                      break;
                    }
                   // let myvar = `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chains.chainRegistry}/chain.json`;
                    CheckRpcUrl(rpcResponse, (err,res) => {
                      if (err || !res){
                        console.error(err)
                      }else{
                        rpcUrltry = rpcResponse;
                        console.log("xxxxxxxxx",rpcUrltry);
                      }
                    })
                  } */
                })
            }
            else {
              rpcUrltry = rpcUrlLink;
              ChainInfo.findChainInfoByIdAndUpdate(chains.chainId, {
                chain_id: chains.chainId, 
                rpc_url: rpcUrltry, 
                chain_info: JSON.stringify(chainInfores),
                is_active: true
              }, (err, chainInfores) => {
                if (err)
                  return console.error(err);
  
              });
            }
  
        });
        });
      };
    });
  }
};

module.exports = Job;
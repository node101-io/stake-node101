const { Cron } = require('croner');

const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const { getRpcUrlFromGithub, checkRpcUrl } = require('../models/ChainInfo/functions/getRpcUrlDataFromGithub');
const ChainInfo = require('../models/ChainInfo/ChainInfo');


const chainsToStake = {
  "cosmoshub": {
    chainKeplrName: "cosmoshub",
    chainId: "cosmoshub-4",
    chainRegistryIdentifier: "cosmoshub",
  },
  "agoric": {
    chainKeplrName: "agoric",
    chainId: "agoric-3",
    chainRegistryIdentifier: "agoric", 
  },
  "celestia": {
    chainKeplrName: "celestia",
    chainId: "celestia",
    chainRegistryIdentifier: "celestia",
  },
  "laozi-mainnet": {
    chainKeplrName: "laozi-mainnet",
    chainId: "laozi-mainnet",
    chainRegistryIdentifier: "bandchain",
  },
  "canto_7700": {
    chainKeplrName: "canto_7700",
    chainId: "canto_7700-1",
    chainRegistryIdentifier: "canto",
  },
  "shentu-2.2": {
    chainKeplrName: "shentu-2.2",
    chainId: "shentu-2.2",
    chainRegistryIdentifier: "shentu",
  },
  "irishub": {
    chainKeplrName: "irishub",
    chainId: "irishub-1",
    chainRegistryIdentifier: "irisnet",
  },
  "cheqd-mainnet": {
    chainKeplrName: "cheqd-mainnet",
    chainId: "cheqd-mainnet-1",
    chainRegistryIdentifier: "cheqd",
  },
  "centauri": {
    chainKeplrName: "centauri",
    chainId: "centauri-1",
    chainRegistryIdentifier: "composable",
  },
  "kyve": {
    chainKeplrName: "kyve",
    chainId: "kyve-1",
    chainRegistryIdentifier: "kyve",
  },
  "umee": {
    chainKeplrName: "umee",
    chainId: "umee-1",
    chainRegistryIdentifier: "umee",
  },
  "assetmantle": {
    chainKeplrName: "mantle",
    chainId: "mantle-1",
    chainRegistryIdentifier: "assetmantle",
  },
  "desmos": {
    chainKeplrName: "desmos-mainnet",
    chainId: "desmos-mainnet",
    chainRegistryIdentifier: "desmos",
  },
  "emoney": {
    chainKeplrName: "emoney",
    chainId: "emoney",
    chainRegistryIdentifier: "emoney",
  },
}

const Job = {
  start: () => {
    Cron('*/10 * * * * *', () => {
      for (const chains of Object.values(chainsToStake)) {
        console.log(`Checking ${chains.chainKeplrName} chain info`);
        getChainInfoFromGithub(chains.chainKeplrName, (err, chainInfo) => {
          if (err)
            return console.error(err);
              getRpcUrlFromGithub(chains.chainRegistryIdentifier, (err, responseList) => {
                  if (err){
                    return console.error(err)
                  }
                  ChainInfo.findChainInfoByIdAndUpdate(chains.chainId, {
                    chain_id: chains.chainId,
                    rpc_url: responseList[0],
                    chain_info: JSON.stringify(chainInfo),
                    is_active: true
                  }, (err, chainInfo) => {
                    if (err)
                      return console.error(err);
                  });
                })
            })
          }
          });
        }
      }

module.exports = Job;
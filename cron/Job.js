const Cron = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlDataFromGithub');

const chainsToStake = {
  "cosmoshub": {
    chainId: "cosmoshub-4",
    chainKeplrIdentifier: "cosmoshub",
    chainRegistryIdentifier: "cosmoshub",
  },
  "agoric": {
    chainId: "agoric-3",
    chainKeplrIdentifier: "agoric",
    chainRegistryIdentifier: "agoric",
  },
  "celestia": {
    chainId: "celestia",
    chainKeplrIdentifier: "celestia",
    chainRegistryIdentifier: "celestia",
  },
  "laozi-mainnet": {
    chainId: "laozi-mainnet",
    chainKeplrIdentifier: "laozi-mainnet",
    chainRegistryIdentifier: "bandchain",
  },
  "canto_7700": {
    chainId: "canto_7700-1",
    chainKeplrIdentifier: "canto_7700",
    chainRegistryIdentifier: "canto",
  },
  "shentu-2.2": {
    chainId: "shentu-2.2",
    chainKeplrIdentifier: "shentu-2.2",
    chainRegistryIdentifier: "shentu",
  },
  "irishub": {
    chainId: "irishub-1",
    chainKeplrIdentifier: "irishub",
    chainRegistryIdentifier: "irisnet",
  },
  "cheqd-mainnet": {
    chainId: "cheqd-mainnet-1",
    chainKeplrIdentifier: "cheqd-mainnet",
    chainRegistryIdentifier: "cheqd",
  },
  "centauri": {
    chainId: "centauri-1",
    chainKeplrIdentifier: "centauri",
    chainRegistryIdentifier: "composable",
  },
  "kyve": {
    chainId: "kyve-1",
    chainKeplrIdentifier: "kyve",
    chainRegistryIdentifier: "kyve",
  },
  "umee": {
    chainId: "umee-1",
    chainKeplrIdentifier: "umee",
    chainRegistryIdentifier: "umee",
  },
  "assetmantle": {
    chainId: "mantle-1",
    chainKeplrIdentifier: "mantle",
    chainRegistryIdentifier: "assetmantle",
  },
  "desmos": {
    chainId: "desmos-mainnet",
    chainKeplrIdentifier: "desmos-mainnet",
    chainRegistryIdentifier: "desmos",
  },
  "emoney": {
    chainId: "emoney",
    chainKeplrIdentifier: "emoney",
    chainRegistryIdentifier: "emoney",
  },
};

const Job = {
  start: () => {
    Cron('*/10 * * * * *', () => {
      for (const chains of Object.values(chainsToStake)) {
        getChainInfoFromGithub(chains.chainKeplrIdentifier, (err, chainInfo) => {
          if (err)
            return console.error(err);

          getRpcUrlFromGithub(chains.chainRegistryIdentifier, (err, rpcUrl) => {
            if (err)
              return console.error(err)

            ChainInfo.findChainInfoByChainIdAndUpdate(chains.chainId, {
              rpc_url: rpcUrl,
              chain_info: JSON.stringify(chainInfo)
            }, (err, chainInfo) => {
              if (err)
                return console.error(err);
            });
          });
        });
      };
    });
  }
};

module.exports = Job;
const Cron = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlDataFromGithub');

const chainsToStake = {
  "cosmoshub": {
    chainId: "cosmoshub-4",
    chainKeplrIdentifier: "cosmoshub",
    chainRegistryIdentifier: "cosmoshub",
    validatorAddress: "cosmosvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cpzvumd",
  },
  "agoric": {
    chainId: "agoric-3",
    chainKeplrIdentifier: "agoric",
    chainRegistryIdentifier: "agoric",
    validatorAddress: "agoricvaloper1k334nqagmmxajt32hdtxrpnsavz0njwa3mtcqc",
  },
  "celestia": {
    chainId: "celestia",
    chainKeplrIdentifier: "celestia",
    chainRegistryIdentifier: "celestia",
    validatorAddress: "celestiavaloper1lrzxwu4dmy8030waevcpft7rpxjjz26csrtqm4",
  },
  "laozi-mainnet": {
    chainId: "laozi-mainnet",
    chainKeplrIdentifier: "laozi-mainnet",
    chainRegistryIdentifier: "bandchain",
    validatorAddress: "band1l8zzhhe3ltlkk7sd38rcw7u6g9d609t24auf82",
  },
  "canto_7700": {
    chainId: "canto_7700-1",
    chainKeplrIdentifier: "canto_7700",
    chainRegistryIdentifier: "canto",
    validatorAddress: "cantovaloper1f3t7qs0r3tfzvxrfszh34dnm8y0qwnzd26s2uj",
  },
  "shentu-2.2": {
    chainId: "shentu-2.2",
    chainKeplrIdentifier: "shentu-2.2",
    chainRegistryIdentifier: "shentu",
    validatorAddress:"certikvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c52q7l0",
  },
  "irishub": {
    chainId: "irishub-1",
    chainKeplrIdentifier: "irishub",
    chainRegistryIdentifier: "irisnet",
    validatorAddress :"iva1lrzxwu4dmy8030waevcpft7rpxjjz26cy9jhgg",
  },
  "cheqd-mainnet": {
    chainId: "cheqd-mainnet-1",
    chainKeplrIdentifier: "cheqd-mainnet",
    chainRegistryIdentifier: "cheqd",
    validatorAddress: "cheqdvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c47206d",

  },
  "centauri": {
    chainId: "centauri-1",
    chainKeplrIdentifier: "centauri",
    chainRegistryIdentifier: "composable",
    validatorAddress: "centaurivaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c6mldw5",
  },
  "kyve": {
    chainId: "kyve-1",
    chainKeplrIdentifier: "kyve",
    chainRegistryIdentifier: "kyve",
    validatorAddress:"kyvevaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cpg4ljc",
  },
  "umee": {
    chainId: "umee-1",
    chainKeplrIdentifier: "umee",
    chainRegistryIdentifier: "umee",
    validatorAddress :"umeevaloper12h8fpmg5qs570rmlem27km5xu4l2gv0lapuels",
  },
  "assetmantle": {
    chainId: "mantle-1",
    chainKeplrIdentifier: "mantle",
    chainRegistryIdentifier: "assetmantle",
    validatorAddress: "Mantlevaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c6d8cnp",

  },
  "desmos": {
    chainId: "desmos-mainnet",
    chainKeplrIdentifier: "desmos-mainnet",
    chainRegistryIdentifier: "desmos",
    validatorAddress: "desmosvaloper1y6j0ych2elrxsqmxg5z39svtdlnkcxql4wvclc",
  },
  "emoney": {
    chainId: "emoney",
    chainKeplrIdentifier: "emoney",
    chainRegistryIdentifier: "emoney",
    validatorAddress: "emoneyvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cv4yf7w",
  },
};

const Job = {
  start: () => {
    /* Cron('/10 * * * * *', () => { */
      console.log('Updating chain info');
      for (const chains of Object.values(chainsToStake)) {
        getChainInfoFromGithub(chains.chainKeplrIdentifier, (err, chainInfo) => {
          if (err)
            return console.error(err);

          getRpcUrlFromGithub(chains.chainRegistryIdentifier, (err, rpcUrl) => {
            if (err)
              return console.error(err)

            ChainInfo.findChainInfoByChainIdAndUpdate(chains.chainId, {
              rpc_url: rpcUrl,
              validator_address: chains.validatorAddress,
              chain_info: JSON.stringify(chainInfo)
            }, (err, chainInfo) => {
              if (err)
                return console.error(err);
            });
          });
        });
      };
  /*   }); */
  }
};

module.exports = Job;
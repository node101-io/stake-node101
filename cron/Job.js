const Cron = require('croner');
const async = require('async');
const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlFromGithub');
const { format } = require('express/lib/response');
const formatChainInfo = require('../models/ChainInfo/functions/formatChainInfo');


const TokenIDList = [
  "cosmoshub-4",
  "agoric-3",
  "celestia",
];

const TokenKeplrList = [
  "cosmoshub",
  "agoric",
  "celestia",
];

const TokenRegistryList = [
  "cosmoshub",
  "agoric",
  "celestia",
];


const chainsToStake = {
  "cosmoshub": {
    chainId: "cosmoshub-4",
    chainKeplrIdentifier: "cosmoshub",
    chainRegistryIdentifier: "cosmoshub",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/chain.png",
    validatorAddress: "cosmosvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cpzvumd",
  },

"agoric": {
    chainId: "agoric-3",
    chainKeplrIdentifier: "agoric",
    chainRegistryIdentifier: "agoric",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/chain.png",
    validatorAddress: "agoricvaloper1k334nqagmmxajt32hdtxrpnsavz0njwa3mtcqc",
    chain_info: ".",
    rpc_url: ".",
    is_active: true
  },
   "celestia": {
    chainId: "celestia",
    chainKeplrIdentifier: "celestia",
    chainRegistryIdentifier: "celestia",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/celestia/chain.png",
    validatorAddress: "celestiavaloper1lrzxwu4dmy8030waevcpft7rpxjjz26csrtqm4",
  },
/*
  "laozi-mainnet": {
    chainId: "laozi-mainnet",
    chainKeplrIdentifier: "laozi-mainnet",
    chainRegistryIdentifier: "bandchain",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/laozi-mainnet/chain.png",
    validatorAddress: "band1l8zzhhe3ltlkk7sd38rcw7u6g9d609t24auf82",
  },
  "canto_7700": {
    chainId: "canto_7700-1",
    chainKeplrIdentifier: "canto_7700",
    chainRegistryIdentifier: "canto",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/canto_7700/chain.png",
    validatorAddress: "cantovaloper1f3t7qs0r3tfzvxrfszh34dnm8y0qwnzd26s2uj",
  },
  "shentu-2.2": {
    chainId: "shentu-2.2",
    chainKeplrIdentifier: "shentu-2.2",
    chainRegistryIdentifier: "shentu",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/shentu-2.2/chain.png",
    validatorAddress:"certikvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c52q7l0",
  },
  "irishub": {
    chainId: "irishub-1",
    chainKeplrIdentifier: "irishub",
    chainRegistryIdentifier: "irisnet",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/irishub/chain.png",
    validatorAddress :"iva1lrzxwu4dmy8030waevcpft7rpxjjz26cy9jhgg",
  },
  "cheqd-mainnet": {
    chainId: "cheqd-mainnet-1",
    chainKeplrIdentifier: "cheqd-mainnet",
    chainRegistryIdentifier: "cheqd",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cheqd-mainnet/chain.png",
    validatorAddress: "cheqdvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c47206d",
  },
  "centauri": {
    chainId: "centauri-1",
    chainKeplrIdentifier: "centauri",
    chainRegistryIdentifier: "composable",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/centauri/chain.png",
    validatorAddress: "centaurivaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c6mldw5",
  },
  "kyve": {
    chainId: "kyve-1",
    chainKeplrIdentifier: "kyve",
    chainRegistryIdentifier: "kyve",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/kyve/chain.png",
    validatorAddress:"kyvevaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cpg4ljc",
  },
  "umee": {
    chainId: "umee-1",
    chainKeplrIdentifier: "umee",
    chainRegistryIdentifier: "umee",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/umee/chain.png",
    validatorAddress :"umeevaloper12h8fpmg5qs570rmlem27km5xu4l2gv0lapuels",
  },
  "assetmantle": {
    chainId: "mantle-1",
    chainKeplrIdentifier: "mantle",
    chainRegistryIdentifier: "assetmantle",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/mantle/chain.png",
    validatorAddress: "Mantlevaloper1lrzxwu4dmy8030waevcpft7rpxjjz26c6d8cnp",
  },
  "desmos": {
    chainId: "desmos-mainnet",
    chainKeplrIdentifier: "desmos-mainnet",
    chainRegistryIdentifier: "desmos",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/desmos-mainnet/chain.png",
    validatorAddress: "desmosvaloper1y6j0ych2elrxsqmxg5z39svtdlnkcxql4wvclc",
  },
  "emoney": {
    chainId: "emoney",
    chainKeplrIdentifier: "emoney",
    chainRegistryIdentifier: "emoney",
    imgUrl: "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/emoney/chain.png",
    validatorAddress: "emoneyvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cv4yf7w",
  }, */ 
};




const Job = {
  start: () => {
    /* Cron('/10 * * * * *', () => { */
      async.timesSeries(
        TokenIDList.length,
        (tokens, next) => {

          getChainInfoFromGithub(TokenKeplrList[tokens], (err, chainInfo) => {
            if (err)
              return console.error(err);
  
            getRpcUrlFromGithub(TokenRegistryList[tokens], (err, rpcUrl) => {
              if (err)
                return console.error(err)

          
          ChainInfo.findChainInfoByChainIdAndUpdate(TokenIDList[tokens], {
            chain_id : TokenIDList[tokens],
            rpc_url: rpcUrl, //`https://rpc.cosmos.directory/${chains.chainRegistryIdentifier}`,
            chain_info: JSON.stringify(chainInfo),
            is_active: true,
            chain_registry_identifier : TokenKeplrList[tokens],
            chain_keplr_identifier : TokenRegistryList[tokens],
          }, (err, chainInfo) => next(err, chainInfo)),
          (err, chainInfo) => {
            if (err)
              return console.error(err);

            return formatChainInfo(null, chainInfo);
          }

      });
          });
        });
    /* }); */
  }
};
 /*        getChainInfoFromGithub(chains.chainKeplrIdentifier, (err, chainInfo) => {
          if (err)
            return console.error(err);

          getRpcUrlFromGithub(chains.chainRegistryIdentifier, (err, rpcUrl) => {
            if (err)
              return console.error(err)
 */
            
    
module.exports = Job;
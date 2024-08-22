const Cron = require('croner');
const async = require('async');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlFromGithub');
const formatChainInfo = require('../models/ChainInfo/functions/formatChainInfo');
const getTokenPrice = require('../models/ChainInfo/functions/getTokenPrice');

const Job = {
  start: () => {
    /* Cron('/10 * * * * *', () => { */
      ChainInfo.findChainInfoByFilters({ is_active:true }, (err, chainInfos) => { 
        if (err)
          return console.error(err);

        async.timesSeries(
          chainInfos.length,
          (time, next) => {

            const keplrIdentifier = chainInfos[time].chain_keplr_identifier;
            const registryIdentifier = chainInfos[time].chain_registry_identifier;
            
            getChainInfoFromGithub(keplrIdentifier, (err, chainInfo) => {
              if (err)
                return console.error(err);

              const token = chainInfo.currencies[0].coinDenom.toLowerCase();

              getTokenPrice(token, (err, tokenPrice) => {
                if (err)
                  return console.error(err);
                
              getRpcUrlFromGithub(registryIdentifier, (err, rpcUrl) => {
                if (err)
                  return console.error(err)

                //console.log(tokenPrice['24h_change']);
                ChainInfo.findChainInfoByChainIdAndUpdate(chainInfos[time].chain_id, {
                  rpc_url: `https://rpc.cosmos.directory/${registryIdentifier}`, //rpcUrl
                  chain_info: JSON.stringify(chainInfo),
                  price: tokenPrice.price,
                  price_change_24h: tokenPrice['24h_change'],

                }, (err, chainInfo) => next(err, chainInfo)),
                (err, chainInfo) => {
                  if (err)
                    return console.error(err);

                  return formatChainInfo(null, chainInfo);
                };
              });
            });
          }
        )},
        );
      });
  /* }); */
  }
};

module.exports = Job;
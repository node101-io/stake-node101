const Cron = require('croner');
const async = require('async');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlFromGithub');
const formatChainInfo = require('../models/ChainInfo/functions/formatChainInfo');
const getTokenPrice = require('../models/ChainInfo/functions/getTokenPrice');
const getAprFromRest = require('../models/ChainInfo/functions/getAprFromRest');
const getTokenPriceChage = require('../models/ChainInfo/functions/getTokenPriceChage');

const Job = {
  start: () => {
    /* Cron('/10 * * * * *', () => { */
    console.log('Job started');
      ChainInfo.findChainInfoByFilters({ is_active:true }, (err, chainInfos) => { 
        if (err)
          return console.error(err);
        async.timesSeries(
          chainInfos.length ,
          (time, next) => {

            const keplrIdentifier = chainInfos[time].chain_keplr_identifier;
            const registryIdentifier = chainInfos[time].chain_registry_identifier;
            
            getChainInfoFromGithub(keplrIdentifier, (err, chainInfo) => {
              if (err)
                return console.error(err);

                getRpcUrlFromGithub(registryIdentifier, (err, rpcUrl) => {
                  if (err)
                    return console.error(err)

                  getAprFromRest(registryIdentifier, (err, apr) => {
                    if (err)
                      console.error(err);

                    getTokenPrice(registryIdentifier, (err, tokenPrice) => {
                      if (err)
                        console.error(err);

                      getTokenPriceChage(chainInfo.currencies[0].coinDenom, (err, tokenPriceChange) => {
                        if (err)
                          console.error(err);

                      ChainInfo.findChainInfoByChainIdAndUpdate(chainInfos[time].chain_id, {
                          rpc_url: `https://rpc.cosmos.directory/${registryIdentifier}` ,
                          rest_url : `https://rest.cosmos.directory/${registryIdentifier}`,
                          chain_info: JSON.stringify(chainInfo),
                          price:  tokenPrice,
                          price_change_24h : 5.5,        
                          apr: apr,
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
      });
  /* }); */
    }
  )},
};

module.exports = Job;
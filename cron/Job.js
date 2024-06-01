const Cron = require('croner');
const async = require('async');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../models/ChainInfo/functions/getRpcUrlFromGithub');
const formatChainInfo = require('../models/ChainInfo/functions/formatChainInfo');

const Job = {
  start: () => {
    /* Cron('/10 * * * * *', () => { */
      ChainInfo.findByFilter({ is_active:true }, (err, chainInfos) => { // findCahinInfoByFilters
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

              getRpcUrlFromGithub(registryIdentifier, (err, rpcUrl) => {
                if (err)
                  return console.error(err)

                ChainInfo.findChainInfoByChainIdAndUpdate(chainInfos[time].chain_id, {
                  rpc_url: rpcUrl, //`https://rpc.cosmos.directory/${chains.chainRegistryIdentifier}`,
                  chain_info: JSON.stringify(chainInfo),
                }, (err, chainInfo) => next(err, chainInfo)),
                (err, chainInfo) => {
                  if (err)
                    return console.error(err);

                  return formatChainInfo(null, chainInfo);
                };
              });
            });
          }
        );
      });
  /* }); */
  }
};

module.exports = Job;
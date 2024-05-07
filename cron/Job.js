const { Cron } = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');

const Job = {
  start: () => {
    Cron('*/5 * * * * *', () => {
      ChainInfo.findChainInfosByFilters({ is_active: true }, (err, chainInfos) => {
        if (err)
          return console.error(err);

        chainInfos.forEach(chainInfo => {
          // TODO: do what you have to do

          // getChainInfoFromGitHub
            // ChainInfo.findChainInfoByIdAndUpdate
        });
      });
    });
  }
};

module.exports = Job;
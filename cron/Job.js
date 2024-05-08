const { Cron } = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const sendMessage = require('../models/ChainInfo/functions/getGithubData');

const chainInfoIds = [ 'cosmoshub'];
const Job = {
  start: () => {

    Cron('*/5 * * * * *', () => {
      console.log('Job is running');

      ChainInfo.findAllChainInfoIds((err, chainInfoIds) => {
        if (err)
          return console.error(err);

        chainInfoIds.forEach(chainInfoId => {
          sendMessage({ id: chainInfoId }, (err, res) => { // TODO: change function name
            if (err)
              return console.error(err);

            if (!res)
              return console.error('bad_request');

            console.log(JSON.stringify(res));
            ChainInfo.findChainInfoByIdAndUpdate(chainInfoId, JSON.stringify(res), () => { }); // callback
            console.log("xcvb");
          });
        });
      });
    });

  }
};

module.exports = Job;
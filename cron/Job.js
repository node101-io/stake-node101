const { Cron } = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getFromGithub = require('../models/ChainInfo/functions/getGithubData');

const chainInfoIds = [
  'cosmoshub',
  'agoric',
  'celestia',
];

const Job = {
  start: () => {
    Cron('*/20 * * * * *', () => {
      for (const chainInfoId of chainInfoIds) {
        getFromGithub(chainInfoId, (err, res) => {
          if (err)
            return console.error(err);

          if (!res)
            return console.error('bad_request');

          ChainInfo.findChainInfoByIdAndUpdate(chainInfoId, {
            chain_id: chainInfoId, // TODO: what if chain_id is different from chainInfoId?
            rpc_url: "https://rpc.cosmos.network:443", // TODO: get rpc like this: https://github.com/node101-io/upgrade-tracker-bot/blob/main/models/chain/functions/getRestAPIListAndMintscanIdFromIdentifier.js
            chain_info: JSON.stringify(res),
            is_active: chainInfoId == "celestia" ? false : true
          }, (err, res) => {
            if (err)
              return console.error(err);

            console.log(res);
          });
        });
      };
    });
  }
};

module.exports = Job;
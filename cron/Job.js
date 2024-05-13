const { Cron } = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const getFromGithub = require('../models/ChainInfo/functions/getGithubData');

const chainInfoIds = [ 
    'cosmoshub',
    'agoric',
    'celestia',
    ];

let currentChainInfoIdIndex = 0;

const Job = {
  start: () => {

    Cron('*/20 * * * * *', () => {
      for (let chainInfoId of chainInfoIds) {
        console.log("chainInfoId: ", chainInfoId)
        getFromGithub(chainInfoId , (err, res) => {
            if (err)
              return console.error(err);

            if (!res)
              return console.error('bad_request');

          let data = {
              "chain_id": chainInfoId,
              "rpc_url": "https://rpc.cosmos.network:443",
              "chain_info": JSON.stringify(res),
              "is_active": chainInfoId == "celestia" ? false : true
            }
            ChainInfo.findChainInfoByIdAndUpdate(chainInfoId, data, (err, res) => {
              if (err)
                return console.error(err);
              
              console.log(res);
             }); 
            console.log("done successfully");
          });
          currentChainInfoIdIndex = (currentChainInfoIdIndex + 1) % chainInfoIds.length;
      }
    }
  );
  }
};

module.exports = Job; 
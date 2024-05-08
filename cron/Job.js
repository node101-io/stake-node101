const { Cron } = require('croner');

const ChainInfo = require('../models/ChainInfo/ChainInfo');
const sendMessage = require('../models/ChainInfo/functions/getGithubData');

const chainInfoIds = [ 'cosmoshub'];
const Job = {
  start: () => {

    Cron('*/5 * * * * *', async () => {
      console.log('Job is running');
      
      ChainInfo.findAllChainInfoIds((err, chainInfoIds) => {
        if (err)
          return console.error(err);
    
        chainInfoIds.forEach(chainInfoId => {
          sendMessage({ id: chainInfoId }, async (err, res) => {
            if (err)
              return console.error(err);
    
            if (!res)
              return console.error('bad_request');
    
            try {
              console.log(JSON.stringify(res));
              await ChainInfo.findChainInfoByIdAndUpdate(chainInfoId,   JSON.stringify(res) );
              console.log("xcvb");
/*               console.log(updatedChainInfo);
 */            } catch (updateErr) {
              console.error(updateErr);
            }
          });
        });
      });
    });
    
  }
};

module.exports = Job;
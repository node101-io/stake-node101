const ChainInfo = require('../../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../../models/ChainInfo/functions/getRpcUrlFromGithub');

module.exports = (req, res) => {
  const data = {};
  data.chain_id = req.body.chain_id;
  data.chain_keplr_identifier = req.body.chain_keplr_identifier;
  data.chain_registry_identifier = req.body.chain_registry_identifier;
  data.img_url = req.body.img_url;
  data.validator_address = req.body.validator_address;
  data.is_active = req.body.is_active;

  getChainInfoFromGithub(req.body.chain_keplr_identifier, (err, chainInfo) => {
    if (err)
      return res.status(500).json({ error: err });
    
    data.chain_info = JSON.stringify(chainInfo);

    getRpcUrlFromGithub(req.body.chain_registry_identifier, (err, rpcUrl) => {
      if (err)
        return res.status(500).json({ error: err });      
      
      data.rpc_url = rpcUrl;
      ChainInfo.createChainInfo(data, (err, chainInfo) => {
        if (err)
          return res.status(500).json({ error: err });
        return res.json({ chainInfo });
      });
    });
  });
};



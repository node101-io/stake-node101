const ChainInfo = require('../../models/ChainInfo/ChainInfo');

const DEFAULT_CHAIN_ID = 'cosmoshub-4';
module.exports = (req, res) => {
  const chain_id = req.query.chain_id && typeof req.query.chain_id == 'string' ? req.query.chain_id : DEFAULT_CHAIN_ID; 

  ChainInfo.findChainInfoByChainId(chain_id, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    return res.json({
      chainInfo
    });
  });
};
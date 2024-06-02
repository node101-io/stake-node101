const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chain_id = req.query.chain_id && typeof req.query.chain_id == 'string' ? req.query.chain_id : "cosmoshub-4"; 

  ChainInfo.findChainInfoByChainId(chain_id, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    return res.json({
      chainInfo: chainInfo,
      test: 2,
    });
  })
}
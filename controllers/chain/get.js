const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chainid = req.query.chainid && typeof req.query.chainid == 'string' ? req.query.chainid : "cosmoshub-4"; // TODO: chainid değil chain_id

  ChainInfo.findChainInfoByChainId(chainid, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    return res.json({
      chainInfo: chainInfo,
      test: 2,
    });
  })
}
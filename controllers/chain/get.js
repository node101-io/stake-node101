const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chainid = req.query.chainid && typeof req.query.chainid == 'string' ? req.query.chainid : "cosmoshub-4";

  ChainInfo.findChainInfoByChainId(chainid, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

      return res.json({
        test: 2,
        chainInfo: chainInfo,
    });
  })
}
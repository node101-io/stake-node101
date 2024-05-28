const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chainId = req.query.chainid || "celestia"; 

  ChainInfo.findChainInfoByChainId(chainId, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

      return res.json({
      chainInfo: chainInfo,
    });
  })
}
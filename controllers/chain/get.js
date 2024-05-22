const ChainInfo = require('../../models/ChainInfo/ChainInfo');

function findChainByChainId (req, res) {
  const chainId = req.query.chainid;

  ChainInfo.findChainInfoByChainId(chainId, (error, chainInfo) => {
      if (error) {
        return res.json({ error: error });
      }
        return res.json({ chainInfo: chainInfo });
    });
}

module.exports = findChainByChainId;

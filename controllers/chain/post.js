const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  ChainInfo.createChainInfo(data, (err, chainInfo) => {
    if (err)
      return res.status(500).json({ error: err });

    return res.json({ chainInfo });
  });
};

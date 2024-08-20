const ChainInfo = require('../../models/ChainInfo/ChainInfo');
const getChainInfoFromGithub = require('../../models/ChainInfo/functions/getChainInfoFromGithub');
const getRpcUrlFromGithub = require('../../models/ChainInfo/functions/getRpcUrlFromGithub');

module.exports = (req, res) => {

  ChainInfo.createChainInfo(data, (err, chainInfo) => {
    if (err)
      return res.status(500).json({ error: err });

    return res.json({ chainInfo });
  });
};

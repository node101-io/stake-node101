const ChainInfo = require('../../models/ChainInfo/ChainInfo');


function findChainByChainId (req, res, chainId) {
  const chainIds = req.params.chainId;
  console.log("1111111111111111")
  console.log(chainIds);
  console.log("2222222222222222")

  const chainInfo = ChainInfo.findOne({ chain_id: chainIds }, (err, chainInfo) => {

    if (err) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(200).json(chainInfo);
  });

}

module.exports = findChainByChainId;

// TODO: remove this file
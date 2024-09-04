const validatorInfo = require('../../models/ChainInfo/ValidatorInfo');
const getChainInfoFromGithub = require('../../models/ChainInfo/functions/getChainInfoFromGithub');

module.exports = (req, res) => {
  if (!req.body.keybase_id || !req.body.image_url)
    return res.status(400).json({ error: 'bad_request'});
  const data = {
    "keybase_id": req.body.keybase_id,
    "image_url": req.body.image_url
  };


  validatorInfo.createValidatorInfo(data, (err, validatorInfo) => {
    if (err)
      return res.status(500).json({ error: err });

    return res.json({ validatorInfo });
  });
};

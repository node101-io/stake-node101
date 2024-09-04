const ValidatorInfo = require('../../models/ChainInfo/ValidatorInfo');

module.exports = (req, res) => {

  const keybase_id = req.query.keybase_id;
  console.log("keybase_id",keybase_id);
  if (!keybase_id || typeof req.query.keybase_id != 'string')
    return res.json({ error: 'bad_request' });

  ValidatorInfo.findImageUrlByKeybaseId(keybase_id, (err, validatorInfo) => {
    if (err)
      return res.json({ error: err });

    return res.json({
      validatorInfo
    });
  });
};
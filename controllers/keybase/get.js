const ValidatorInfo = require('../../models/ChainInfo/ValidatorInfo');
const getKeybasePicture = require('../../models/ChainInfo/functions/getKeybasePicture');

module.exports = (req, res) => {

  const keybase_id = req.query.keybase_id;

  if (!keybase_id || typeof req.query.keybase_id != 'string')
    return res.json({ error: 'bad_request' });

  ValidatorInfo.findImageUrlByKeybaseId(keybase_id, (err, validatorInfo) => {
    if (err && err == 'document_not_found') {
      getKeybasePicture(keybase_id, (err, picture) => {
        if (err)
          return res.json({ error: err });
        const data = {
          "keybase_id": keybase_id,
          "image_url": picture,
        };
        ValidatorInfo.createValidatorInfo(data, (err, validatorInfo) => {
          if (err)
            return res.json({ error: err });
          return res.json({ validatorInfo });
        });
      });
    }
    else {
    return res.json({
      validatorInfo
    });
    }
  });
};
const validatorInfo = require('../../models/ChainInfo/ValidatorInfo');
const getKeybasePicture = require('../../models/ChainInfo/functions/getKeybasePicture');


module.exports = (req, res) => {
  if (!req.body.keybase_id || !req.body.image_url)
    return res.status(400).json({ error: 'bad_request'});
 

  getKeybasePicture(data.keybase_id, (err, picture) => {
    if (err)
      return res.status(500).json({ error: err });
    
  
      const data = {
        "keybase_id": req.body.keybase_id,
        "image_url": picture,
      };

    validatorInfo.createValidatorInfo(data, (err, validatorInfo) => {
      if (err)
        return res.status(500).json({ error: err });

      return res.json({ picture });
    });
  });
}
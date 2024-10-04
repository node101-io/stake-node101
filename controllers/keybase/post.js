const ValidatorInfo = require('../../models/ChainInfo/ValidatorInfo');
const async = require('async');
const getKeybasePicture = require('../../models/ChainInfo/functions/getKeybasePicture');

module.exports = (req, res) => {
  const keybaseIdList = req.body.keybaseIdList;

  if (!keybaseIdList || !Array.isArray(keybaseIdList)) {
    return res.json({ error: 'bad_request' });
  }
  
  for (let i = 0; i < keybaseIdList.length; i++) {
    if (typeof keybaseIdList[i] !== 'string') {
      return res.json({ error: 'bad_request' });
    }
  }

  const validatorInfoList = [];

  async.times(
    keybaseIdList.length,
    (time, next) => {
      const keybase_id = keybaseIdList[time];
      
      ValidatorInfo.findImageUrlByKeybaseId(keybase_id, (err, validatorInfo) => {
        if (err && err === 'document_not_found') {

          getKeybasePicture(keybase_id, (err, picture) => {
            if (err) {
              return next(err);
            }
            
            const data = {
              keybase_id: keybase_id,
              image_url: picture,
            };
            
            ValidatorInfo.createValidatorInfo(data, (err, newValidatorInfo) => {
              if (err) {
                return next(err);
              }
              validatorInfoList.push(newValidatorInfo);
              return next(null, newValidatorInfo);
            });
          });
        } else {

          if (!err && validatorInfo) {
            validatorInfoList.push(validatorInfo);
          }
          return next(err, validatorInfo);
        }
      });
    }, err => {
      if (err) {
        return res.json({ error: err });
      }
      
      return res.json({ validatorInfoList });
    }
  );
};

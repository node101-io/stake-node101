const mongoose = require('mongoose');

const formatValidatorInfo = require('./functions/formatValidatorInfo');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const DEFAULT_IS_ACTIVE = true;
const KEYBASE_ID_LEN = 16; 

const Schema = mongoose.Schema;

const ValidatorSchema = new Schema({
  keybase_id : {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: KEYBASE_ID_LEN,
    maxlength: KEYBASE_ID_LEN
  },
  image_url: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
});


ValidatorSchema.statics.createValidatorInfo = function (data, callback) {
  const ValidatorInfo = this;
  if (!data.keybase_id || typeof data.keybase_id != 'string' || data.keybase_id.trim().length < KEYBASE_ID_LEN|| data.keybase_id.trim().length > KEYBASE_ID_LEN)
    return callback('bad_request');

  if (!data.image_url || typeof data.image_url != 'string' || data.image_url.trim().length < 1 || data.image_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');


  if (!Object.keys(data).length)
    return callback('bad_request');

  const newValidatorInfo = new ValidatorInfo({
    keybase_id: data.keybase_id.trim(),    
    image_url: data.image_url.trim(),
  });

  newValidatorInfo.save((err, validatorInfo) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err){ 
      return callback('database_error');
    }
    formatValidatorInfo(validatorInfo, (err, validatorInfo ) => {
      if (err)
        return callback('database_error');

      return callback(null, validatorInfo);
    });
  });
};

ValidatorSchema.statics.findImageUrlByKeybaseId = function (keybase_id, callback) {
  const ChainInfo = this;

  if (!keybase_id || typeof keybase_id != 'string' || keybase_id.trim().length < KEYBASE_ID_LEN || keybase_id.trim().length > KEYBASE_ID_LEN)
    return callback('bad_request');

  ChainInfo.findOne({ keybase_id }, (err, validatorInfo) => {
    if (err){
      return callback('database_error');
    }
    formatValidatorInfo(validatorInfo, (err, validatorInfo) => {
      if (err){
        return callback(err);
      }
      return callback(null, validatorInfo);
    });
  });
};

module.exports = mongoose.model('ValidatorInfo', ValidatorSchema);
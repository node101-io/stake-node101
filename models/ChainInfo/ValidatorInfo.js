const mongoose = require('mongoose');

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

ValidatorSchema.statics.createChainInfo = function (data, callback) {
  const ChainInfo = this;

  if (!data.chain_id || typeof data.chain_id != 'string' || data.chain_id.trim().length < 1 || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_keplr_identifier || typeof data.chain_keplr_identifier != 'string' || data.chain_keplr_identifier.trim().length < 1 || data.chain_keplr_identifier.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_registry_identifier || typeof data.chain_registry_identifier != 'string' || data.chain_registry_identifier.trim().length < 1 || data.chain_registry_identifier.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.img_url || typeof data.img_url != 'string' || data.img_url.trim().length < 1 || data.img_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.validator_address || typeof data.validator_address != 'string' || data.validator_address.trim().length < 1 || data.validator_address.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  
  if ('is_active' in data && typeof data.is_active != 'boolean')
    return callback('bad_request');

  if (!data.rpc_url || typeof data.rpc_url != 'string' || data.rpc_url.trim().length < 1 || data.rpc_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_info || typeof data.chain_info != 'string' || data.chain_info.trim().length < 1 || data.chain_info.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');


  if (!Object.keys(data).length)
    return callback('bad_request');

  const newChainInfo = new ChainInfo({
    chain_id: data.chain_id.trim(),
    chain_keplr_identifier: data.chain_keplr_identifier.trim(),
    chain_registry_identifier: data.chain_registry_identifier.trim(),
    rpc_url: data.rpc_url.trim(),
    img_url: data.img_url.trim(),
    validator_address: data.validator_address.trim(),
    chain_info: data.chain_info.trim(),
    is_active:  data.is_active,
  });

  newChainInfo.save((err, chainInfo) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, (err, chainInfo) => {
      if (err)
        return callback('database_error');

      return callback(null, chainInfo);
    });
  });
};

ChainInfoSchema.statics.findChainInfoByChainId = function (chain_id, callback) {
  const ChainInfo = this;

  if (!chain_id || typeof chain_id != 'string' || chain_id.trim().length < 1 || chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  ChainInfo.findOne({ chain_id }, (err, chainInfo) => {
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, (err, chainInfo) => {
      if (err)
        return callback('database_error');

      return callback(null, chainInfo);
    });
  });
};

module.exports = mongoose.model('Validator', ValidatorSchema);
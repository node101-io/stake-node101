const mongoose = require('mongoose');
const validator = require('validator');

const formatChainInfo = require('./functions/formatChainInfo');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ChainInfoSchema = new Schema({
  chain_id: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  rpc_url: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  chain_info: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  }
  // TODO: is_active: Boolean
});

ChainInfoSchema.statics.createChainInfo = function (data, callback) {
  const ChainInfo = this;

  console.log(data);
  if (!data.chain_id || typeof data.chain_id != 'string' || data.chain_id.trim().length < 1 || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  console.log(data);
  if (!data.rpc_url || typeof data.rpc_url != 'string' || data.rpc_url.trim().length < 1 || data.rpc_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_info || typeof data.chain_info != 'string' || data.chain_info.trim().length < 1 || data.chain_info.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  const newChainInfo = new ChainInfo({
    chain_id: data.chain_id.trim(),
    rpc_url: data.rpc_url.trim(),
    chain_info: data.chain_info.trim()
  });

  newChainInfo.save((err, chainInfo) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, callback);
  });
};

// ChainInfoSchema.statics.findChainInfosByFilters

module.exports = mongoose.model('ChainInfo', ChainInfoSchema);
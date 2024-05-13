const mongoose = require('mongoose');

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
    type: Object,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

ChainInfoSchema.statics.createChainInfo = function (data, callback) {
  const ChainInfo = this;
  
  if (!data.chain_id || typeof data.chain_id != 'string' || data.chain_id.trim().length < 1 || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.rpc_url || typeof data.rpc_url != 'string' || data.rpc_url.trim().length < 1 || data.rpc_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_info || typeof data.chain_info != 'string' || data.chain_info.trim().length < 1 || data.chain_info.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (typeof data.is_active != 'boolean')
    return callback('bad_request');

  if (!Object.keys(data).length) {{
    return callback('bad_request');
  }}

  
  const newChainInfo = new ChainInfo({
    chain_id: data.chain_id.trim(),
    rpc_url: data.rpc_url.trim(),
    chain_info: data.chain_info.trim(),
    is_active: data.is_active
  });

  newChainInfo.save((err, chainInfo) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, callback);
  });
};


ChainInfoSchema.statics.findChainInfoByIdAndUpdate = function (chain_id, data, callback) {
  const ChainInfo = this;
  if (!chain_id || typeof chain_id != 'string' || chain_id.trim().length < 1 || chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const updateData = {};

  if (data.chain_id && typeof data.chain_id == 'string' && data.chain_id.trim().length > 0 && data.chain_id.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.chain_id = data.chain_id.trim();

  if (data.rpc_url && typeof data.rpc_url == 'string' && data.rpc_url.trim().length > 0 && data.rpc_url.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.rpc_url = data.rpc_url.trim();

  if (data.chain_info && typeof data.chain_info == 'string' && data.chain_info.trim().length > 0 && data.chain_info.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.chain_info = data.chain_info.trim();

  if (typeof data.is_active == 'boolean')
    updateData.is_active = data.is_active;

  ChainInfo.findOneAndUpdate({ chain_id },  updateData , { returnOriginal: false }, (err, updateData) => {

    if (err) {
      return callback('database_error');
    };
    formatChainInfo(updateData, callback);
  });
};


// create chain info
/* 
  const chax = mongoose.model('ChainInfo', ChainInfoSchema);
  const instance1 = chax.createChainInfo({
  chain_id: 'cosmoshub-4',
  rpc_url: 'https://rpc.cosmos.network:26657',
  chain_info: 'cosmoshub-4',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);

});   
*/



/*   const chax = mongoose.model('ChainInfo', ChainInfoSchema);
  const instance1 = chax.createChainInfo({
  chain_id: 'clestia',
  rpc_url: 'https://rpc.celestia.network:26657',
  chain_info: 'celestia',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});  */  
 

module.exports = mongoose.model('ChainInfo', ChainInfoSchema);
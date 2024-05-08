const mongoose = require('mongoose');
/* const validator = require('validator');
 */
const formatChainInfo = require('./functions/formatChainInfo');
const { call } = require('body-parser');

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
/*     maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
 */  },
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

/* ChainInfoSchema.statics.findChainInfosByFilters = function (data, callback) {
  const ChainInfo = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  if (data.chain_id) {
    if (typeof data.chain_id != 'string' || data.chain_id.trim().length < 1 || data.chain_id.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    filters.chain_id = data.chain_id.trim();
  }

  if (data.rpc_url) {
    if (typeof data.rpc_url != 'string' || data.rpc_url.trim().length < 1 || data.rpc_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    filters.rpc_url = data.rpc_url.trim();
  }

  if (data.chain_info) {
    if (typeof data.chain_info != 'string' || data.chain_info.trim().length < 1 || data.chain_info.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
      return callback('bad_request');

    filters.chain_info = data.chain_info.trim();
  }

  ChainInfo.find(filters, (err, chainInfos) => {
    if (err)
      return callback('database_error');

    const formattedChainInfos = chainInfos.map(chainInfo => formatChainInfo(chainInfo));

    callback(null, formattedChainInfos);
  });

} */

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

  // TODO: finish this function

  console.log("333333333");
  ChainInfo.findOneAndUpdate({ chain_id: chain_id }, { updateData }, (err, chainInfo) => {
    console.log(err, chainInfo);

    if (err) {
      console.log("yyyyyyyyyyyyyyy");
      console.log(typeof chain_info);
      console.log(typeof chain_info == 'object');
      return callback('database_error');
    };

    formatChainInfo(chainInfo, callback);
  });
};

ChainInfoSchema.statics.findAllChainInfoIds = function(callback) {
  const ChainInfo = this;

  // Query the database, retrieving only the 'chain_id' field for all documents
  ChainInfo.find({}, 'chain_id', (err, chains) => {
    if (err) {
      return callback('database_error');
    }

    // Extract just the chain_id values from the documents
    const chainIds = chains.map(chain => chain.chain_id);
    callback(null, chainIds);
  });
};


// create chain info
 const chax = mongoose.model('ChainInfo', ChainInfoSchema);


/* const instance1 = chax.createChainInfo({
  chain_id: 'cosmoshub-4',
  rpc_url: 'https://rpc.cosmos.network:26657',
  chain_info: 'cosmoshub-4',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);

  console.log(chainInfo, "xxxxxxxx");
});   */

module.exports = mongoose.model('ChainInfo', ChainInfoSchema);
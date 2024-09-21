const mongoose = require('mongoose');

const formatChainInfo = require('./functions/formatChainInfo');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const DEFAULT_IS_ACTIVE = true;

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
  chain_keplr_identifier: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  chain_registry_identifier: {
    type: String,
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
  img_url: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  validator_address: {
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
    required: true,
    default: DEFAULT_IS_ACTIVE
  },
  price: {
    type: Number,
    default: 0
  },
  price_change_24h: {
    type: Number,
    default: 0
  },
  apr: {
    type: Number,
    default: 0,
  }
});

ChainInfoSchema.statics.createChainInfo = function (data, callback) {
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

  if (!data.rpc_url || typeof data.rpc_url != 'string' || data.rpc_url.trim().length < 1 || data.rpc_url.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.chain_info || typeof data.chain_info != 'string' || data.chain_info.trim().length < 1 || data.chain_info.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if ('is_active' in data && typeof data.is_active != 'boolean')
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

ChainInfoSchema.statics.findChainInfoByFilters = function (data, callback) {
  const ChainInfo = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  if (data.chain_id && typeof data.chain_id == 'string' && data.chain_id.trim().length > 0 && data.chain_id.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.chain_id = data.chain_id.trim();

  if (data.chain_keplr_identifier && typeof data.chain_keplr_identifier == 'string' && data.chain_keplr_identifier.trim().length > 0 && data.chain_keplr_identifier.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.chain_keplr_identifier = data.chain_keplr_identifier.trim();

  if (data.chain_registry_identifier && typeof data.chain_registry_identifier == 'string' && data.chain_registry_identifier.trim().length > 0 && data.chain_registry_identifier.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.chain_registry_identifier = data.chain_registry_identifier.trim();

  if (data.rpc_url && typeof data.rpc_url == 'string' && data.rpc_url.trim().length > 0 && data.rpc_url.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.rpc_url = data.rpc_url.trim();

  if (data.img_url && typeof data.img_url == 'string' && data.img_url.trim().length > 0 && data.img_url.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.img_url = data.img_url.trim();

  if (data.validator_address && typeof data.validator_address == 'string' && data.validator_address.trim().length > 0 && data.validator_address.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.validator_address = data.validator_address.trim();

  if (data.chain_info && typeof data.chain_info == 'string' && data.chain_info.trim().length > 0 && data.chain_info.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.chain_info = data.chain_info.trim();

  if ('is_active' in data && typeof data.is_active == 'boolean')
    filters.is_active = data.is_active;

  ChainInfo.find(filters, (err, chainInfo) => {
    if (err)
      return callback('database_error');

    return callback(null, chainInfo);
  });
};

ChainInfoSchema.statics.findChainInfoByChainIdAndUpdate = function (chain_id, data, callback) {
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

  if (data.img_url && typeof data.img_url == 'string' && data.img_url.trim().length > 0 && data.img_url.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.img_url = data.img_url.trim();

  if (data.chain_keplr_identifier && typeof data.chain_keplr_identifier == 'string' && data.chain_keplr_identifier.trim().length > 0 && data.chain_keplr_identifier.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.chain_keplr_identifier = data.chain_keplr_identifier.trim();

  if (data.chain_registry_identifier && typeof data.chain_registry_identifier == 'string' && data.chain_registry_identifier.trim().length > 0 && data.chain_registry_identifier.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.chain_registry_identifier = data.chain_registry_identifier.trim();

  if (data.validator_address && typeof data.validator_address == 'string' && data.validator_address.trim().length > 0 && data.validator_address.trim().length <= MAX_DATABASE_TEXT_FIELD_LENGTH)
    updateData.validator_address = data.validator_address.trim();

  if (data.price && typeof data.price == 'number' && data.price >= 0)
    updateData.price = data.price;

  if (data.price_change_24h && typeof data.price_change_24h == 'number')
    updateData.price_change_24h = data.price_change_24h;

  if (data.apr )
    updateData.apr = data.apr;

  if ('is_active' in data && typeof data.is_active == 'boolean')
    updateData.is_active = data.is_active;

  if (!Object.keys(updateData).length)
    return callback('bad_request');

  ChainInfo.findOneAndUpdate({ chain_id }, updateData, (err, chainInfo) => {
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, (err, chainInfo) => {
      if (err)
        return callback('database_error');

      return callback(null, chainInfo);
    });
  });
};

ChainInfoSchema.statics.getListOfToken = function (is_active, callback) {

  const ChainInfo = this;

  if(typeof is_active == 'boolean' && is_active == false) 
    return callback('bad_request');

  ChainInfo.find( is_active , (err, chainInfos) => {
    if (err)
      return callback('database_error');

    const listOfToken = {};
    for (let i = 0; i < chainInfos.length; i++) {
      const chainName = JSON.parse(chainInfos[i].chain_info).chainName;
    
      listOfToken[chainInfos[i].chain_id] = {
        'chain_id': chainInfos[i].chain_id,
        'chain_name': chainName,
        'img_url': chainInfos[i].img_url,
        'coin_denom': JSON.parse(chainInfos[i].chain_info).currencies[0].coinDenom,
        'price': chainInfos[i].price,
        'price_change_24h': chainInfos[i].price_change_24h,
        'apr': chainInfos[i].apr,
      };
    }
    return callback(null, listOfToken);
  });
};

module.exports = mongoose.model('ChainInfo', ChainInfoSchema);
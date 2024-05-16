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

  if ('is_active' in data && typeof data.is_active != 'boolean')
    return callback('bad_request');

  if (!Object.keys(data).length)
    return callback('bad_request');

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

// TODO: findChainInfoByChainIdAndUpdate change function name
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

  if ('is_active' in data && typeof data.is_active == 'boolean')
    updateData.is_active = data.is_active;

  if (!Object.keys(updateData).length)
    return callback('bad_request');

  ChainInfo.findOneAndUpdate({ chain_id }, updateData, (err, chainInfo) => {
    if (err)
      return callback('database_error');

    formatChainInfo(chainInfo, callback);
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


/* 
  const chax = mongoose.model('ChainInfo', ChainInfoSchema);
  const instance1 = chax.createChainInfo({
  chain_id: 'laozi-mainnet',
  rpc_url: 'https://rpc.celestia.network:26657',
  chain_info: 'celestia',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});   */


/*

/*   "canto_7700": {
    chainKeplrName: "canto_7700",
    chainId: "canto_7700-1",
    chainRegistryIdentifier: "canto",
  },
  "shentu-2.2": {
    chainKeplrName: "shentu-2.2",
    chainId: "shentu-2.2",
    chainRegistryIdentifier: "shentu",
  },
  "irishub": {
    chainKeplrName: "irishub",
    chainId: "irishub-1",
    chainRegistryIdentifier: "irisnet",
  },
  "cheqd-mainnet": {
    chainKeplrName: "cheqd-mainnet",
    chainId: "cheqd-mainnet-1",
    chainRegistryIdentifier: "cheqd",
  },
  "centauri": {
    chainKeplrName: "centauri",
    chainId: "centauri-1",
    chainRegistryIdentifier: "composable",
  },
  "kyve": {
    chainKeplrName: "kyve",
    chainId: "kyve-1",
    chainRegistryIdentifier: "kyve",
  },
  "umee": {
    chainKeplrName: "umee",
    chainId: "umee-1",
    chainRegistryIdentifier: "umee",
  },
  "assetmantle": {
    chainKeplrName: "assetmantle",
    chainId: "mantle",
    chainRegistryIdentifier: "assetmantle",
  },
  "desmos": {
    chainKeplrName: "desmos",
    chainId: "desmos-mainnet",
    chainRegistryIdentifier: "desmos",
  },
  "emoney": {
    chainKeplrName: "emoney",
    chainId: "emoney",
    chainRegistryIdentifier: "emoney",
  }, */
/* 
  const chax = mongoose.model('ChainInfo', ChainInfoSchema);
  const instance1 = chax.createChainInfo({
  chain_id: 'canto_7700-1',
  rpc_url: 'https://rpc.canto.network:26657',
  chain_info: 'canto_7700',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
})

const instance2 = chax.createChainInfo({
  chain_id: 'shentu-2.2',
  rpc_url: 'https://rpc.shentu.network:26657',
  chain_info: 'shentu-2.2',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});

const instance3 = chax.createChainInfo({
  chain_id: 'irishub-1',
  rpc_url: 'https://rpc.irisnet.network:26657',
  chain_info: 'irishub',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});

const instance4 = chax.createChainInfo({
  chain_id: 'cheqd-mainnet-1',
  rpc_url: 'https://rpc.cheqd.network:26657',
  chain_info: 'cheqd-mainnet',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});

const instance5 = chax.createChainInfo({
  chain_id: 'centauri-1',
  rpc_url: 'https://rpc.composable.network:26657',
  chain_info: 'centauri',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});


const instance6 = chax.createChainInfo({
  chain_id: 'kyve-1',
  rpc_url: 'https://rpc.kyve.network:26657',
  chain_info: 'kyve',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});


const instance7 = chax.createChainInfo({
  chain_id: 'umee-1',
  rpc_url: 'https://rpc.umee.network:26657',
  chain_info: 'umee',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});


const instance8 = chax.createChainInfo({
  chain_id: 'mantle',
  rpc_url: 'https://rpc.assetmantle.network:26657',
  chain_info: 'assetmantle',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});


const instance9 = chax.createChainInfo({
  chain_id: 'desmos-mainnet',
  rpc_url: 'https://rpc.desmos.network:26657',
  chain_info: 'desmos',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});


const instance10 = chax.createChainInfo({
  chain_id: 'emoney',
  rpc_url: 'https://rpc.emoney.network:26657',
  chain_info: 'emoney',
  is_active: true
}, (err, chainInfo) => {
  if (err)
    return console.error(err);
});











 */

module.exports = mongoose.model('ChainInfo', ChainInfoSchema);
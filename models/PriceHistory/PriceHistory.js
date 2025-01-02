const mongoose = require('mongoose');

const ChainInfo = require('../ChainInfo/ChainInfo');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const PriceHistorySchema = new Schema({
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  chain_id: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  }
});

PriceHistorySchema.statics.createPriceHistory = function (data, callback) {
  const PriceHistory = this;

  if (!data.price || typeof data.price != 'number')
    return callback('bad_request');

  if (!data.chain_id || typeof data.chain_id != 'string' || data.chain_id.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  const newPriceHistory = new PriceHistory({
    price: data.price,
    date: new Date(),
    chain_id: data.chain_id.trim(),
  });

  newPriceHistory.save((err, priceHistory) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, priceHistory);
  });
};

PriceHistorySchema.statics.get24hPriceHistory = function (chain_id, callback) {
  const PriceHistory = this;

  PriceHistory
    .find({ chain_id: chain_id })
    .sort({ date: -1 })
    .limit(24)
    .exec((err, priceHistories) => {
      if (err)
        return callback('database_error');

      if (priceHistories.length == 0)
        return callback(null, null);

      const priceAt24hAgo = priceHistories[priceHistories.length - 1].price;

      return callback(null, priceAt24hAgo);
    });
};

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);

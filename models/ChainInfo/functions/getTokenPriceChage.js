const fetch = require('node-fetch');

module.exports = (token, callback) =>  {
  token = token.toUpperCase();
  fetch(`https://min-api.cryptocompare.com/data/generateAvg?fsym=${token}&tsym=USD&e=Kraken`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback(null, 0);

      const priceChange24h = res?.RAW.CHANGEPCT24HOUR || 0;
      return callback(null, priceChange24h);
    })
    .catch(_ => {
      return callback(null, 0);
    });
};



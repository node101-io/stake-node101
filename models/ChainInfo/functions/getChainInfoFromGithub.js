const fetch = require('node-fetch');

module.exports = (identifier, callback) => {
  console.log('identifier', identifier);
  fetch(`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/cosmos/${identifier}.json`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');

      return callback(null, res);
    })
    .catch(_ => {
      return callback('network_error');
    });
};
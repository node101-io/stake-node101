const fetch = require('node-fetch');

const getChainInfoFromGithub = (identifier, callback) => {
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

module.exports = getChainInfoFromGithub;

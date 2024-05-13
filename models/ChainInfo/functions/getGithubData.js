const fetch = require('node-fetch');

const getFromGithub = (chain_id, callback) => {
  fetch(`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/cosmos/${chain_id}.json`)
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

module.exports = getFromGithub;

// TODO: getChainInfoFromGithub change function and file name
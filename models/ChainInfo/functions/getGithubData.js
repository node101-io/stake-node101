const fetch = require('node-fetch');


const getFromGithub = (message, callback) => {
  fetch(`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/cosmos/cosmoshub.json`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('bad_request');
      return callback(null, res);
    })
    .catch(_ => {
      return callback('network_error');
    });
};


module.exports = getFromGithub;
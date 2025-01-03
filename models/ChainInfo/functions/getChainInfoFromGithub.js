module.exports = (identifier, callback) => {
  fetch(`https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/cosmos/${identifier.trim()}.json`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');

      return callback(null, res);
    })
    .catch(err => {
      return callback('network_error');
    });
};
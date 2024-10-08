const fetch = require('node-fetch');

module.exports = (identifier, callback) =>  {
  fetch(`https://api-osmosis.imperator.co/tokens/v2/price/${identifier}`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');
      return callback(null, res);
    })
    .catch(_ => {
      return callback('document_not_found');
    });
};



const fetch = require('node-fetch');

const COMMISION_RATE = 0.05;

module.exports = (identifier, callback) =>  {
  fetch(`https://chains.cosmos.directory/`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');

      const chains = res.chains
      const selectedChain = chains.filter(chains => chains.name === identifier)[0];
      const chainApr = selectedChain.params.calculated_apr;
      const realApr = chainApr * (1 - COMMISION_RATE);
      return callback(null, Math.round(realApr * 10000) / 100);
    })
    .catch(_ => {
      return callback('document_not_found');
    });
};



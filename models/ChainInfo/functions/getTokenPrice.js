const fetch = require('node-fetch');

module.exports = (identifier, callback) =>  {
  fetch(`https://chains.cosmos.directory/`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');

      const chains = res.chains
      const selectedChain = chains.filter(chains => chains.name === identifier)[0];
      const chainPrice = selectedChain.prices.coingecko[selectedChain.symbol.toLowerCase()]?.usd;
      return callback(null, chainPrice);
    })
    .catch(_ => {
      return callback('document_not_found');
    });
};



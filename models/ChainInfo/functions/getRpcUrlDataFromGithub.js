const fetch = require('node-fetch');

const getRpcUrlFromGithub = (identifier, callback) => {
  fetch(`https://raw.githubusercontent.com/cosmos/chain-registry/master/${identifier}/chain.json`)
    .then(res => res.json())
    .then(res => {
      const providers = res.apis?.rpc;

      const rpc_api_list = [];

      for (let i = 0; i < providers?.length && i < 1 ; i++)
        rpc_api_list.push(providers[i].address);

      if (!rpc_api_list.length)
        return callback('document_not_found');

      return callback(null, rpc_api_list[0]);
    })
    .catch(_ => {
      return callback('document_not_found');
    });
};

// const checkRpcUrl = (rpcUrl, callback) => {
//   fetch(rpcUrl)
//     .then(res => {
//       if (!res.ok)
//         return callback('document_not_found');

//       return callback(null, rpcUrl);
//     })
//     .catch(_ => {
//       return callback('document_not_found');
//     });
// };

module.exports = getRpcUrlFromGithub;
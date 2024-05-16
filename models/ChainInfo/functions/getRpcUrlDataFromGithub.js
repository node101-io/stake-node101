const fetch = require('node-fetch');


const getRpcUrlFromGithub = (identifier, callback) => {
    fetch(`https://raw.githubusercontent.com/cosmos/chain-registry/master/${identifier}/chain.json`)
      .then(res => res.json())
      .then(json => {
        const providers = json.apis?.rpc;

        const rpc_api_list = [

        ];

        for (let i = 0; i < providers?.length && i < 1 ; i++)
          rpc_api_list.push(providers[i].address);
        if (!rpc_api_list)
          return callback('document_not_found', null);

        return callback(null,
          rpc_api_list,
        );
      })
      .catch(_ => {
        return callback('document_not_found', null);
      });
  };



  const checkRpcUrl = (rpcUrltry, callback) => {
    fetch(rpcUrltry)
      .then((res) => {
        if (!res.ok)
          return callback('document_not_found', null);

        return callback(null, rpcUrltry);
      })
      .catch(_ => {
        callback('document_not_found', null);
      });
  }


// export the function
module.exports = {
  getRpcUrlFromGithub,
  checkRpcUrl
};
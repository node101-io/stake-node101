const fetch = require('node-fetch');


const getRpcUrl = (identifier, callback) => {
    fetch(`https://raw.githubusercontent.com/cosmos/chain-registry/master/${identifier}/chain.json`)
      .then(res => res.json())
      .then(json => {
        const providers = json.apis?.rpc;

        const rpc_api_list = [

        ];

        for (let i = 0; i < providers?.length ; i++)
          rpc_api_list.push(providers[i].address);
       // console.log(rpc_api_list);
        if (!rpc_api_list)
          return callback('1document_not_found', null);

        return callback(null,
          rpc_api_list,
        );
      })
      .catch(_ => {
        return callback('2document_not_found', null);
      });
  };



  const CheckRpcUrl = (rpcUrltry, callback) => {
    fetch(rpcUrltry)
      .then((res) => {
        if (!res.ok)
          return callback('3document_not_found', null);

        return callback(null, rpcUrltry);
      })
      .catch(_ => {
        callback('4document_not_found', null);
      });
  }
/*
  CheckRpcUrl("cosmoshub",(err,res) => {
    if (err){
        console.log(err)
    }
    console.log(res)
  }) */


// export the function
module.exports = {
  getRpcUrl,
  CheckRpcUrl
};
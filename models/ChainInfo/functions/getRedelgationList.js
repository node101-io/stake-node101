
const { SigningStargateClient } = require("@cosmjs/stargate");


module.exports = (delegatorAddress, callback) => {
    
  const rpcEndpoint = "https://rpc.cosmos.directory/cosmoshub"; 
  const validatorList = [];
  SigningStargateClient.connectWithSigner(rpcEndpoint).then((client) => {
    client.queryClient.staking.delegatorValidators(delegatorAddress).then((redelegations) => {
      redelegations.validators.forEach((validator) => {
          validatorList.push({
            operatorAddress: validator.operatorAddress,
            moniker: validator.description.moniker,
            identity: validator.description.identity
          })
      });
      return callback(null, validatorList);

    });
  }).catch(_ => {
    return callback('1document_not_found');
  });
};




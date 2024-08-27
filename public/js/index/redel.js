
const { SigningStargateClient } = require("@cosmjs/stargate");


function getDelegations(delegatorAddress, callback) {
  const validatorList = [];
  const rpcEndpoint = "https://rpc.cosmos.directory/cosmoshub"; 

  SigningStargateClient.connectWithSigner(rpcEndpoint).then((client) => {
    client.queryClient.staking.delegatorValidators(delegatorAddress).then((redelegations) => {
      redelegations.validators.forEach((validator) => {
          validatorList.push({
            operatorAddress: validator.operatorAddress,
            moniker: validator.description.moniker,
            identity: validator.description.identity
          })
      });       
    });
  }).then(() => {
    console.log(validatorList);
  }).catch(_ => {
    return callback('document_not_found');
  });
};

const delegatorAddress = "cosmos1nhzfugalfm29htfep7tx3y5fhm8jhks5cy48sl"; // Replace with the delegator's address
getDelegations(delegatorAddress);


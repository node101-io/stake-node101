const { SigningStargateClient } = require("@cosmjs/stargate");
const getKeybasePicture = require("./getKeybasePicture");

module.exports = (delegatorAddress, callback)  => {
  const rpcEndpoint = "https://rpc.cosmos.directory/cosmoshub";
  const validatorList = [];

  SigningStargateClient.connectWithSigner(rpcEndpoint)
    .then(async (client) => {
      try {
        const redelegations = await client.queryClient.staking.delegatorValidators(delegatorAddress);

        for (const validator of redelegations.validators) {
          const validatorInfo = {
            operatorAddress: validator.operatorAddress,
            moniker: validator.description.moniker,
            identity: validator.description.identity,
          };

          getKeybasePicture(validatorInfo.identity, (err, res) => {
            if (err) {
              console.error(err);
            } else {
              validatorInfo.picture = res;
              validatorList.push(validatorInfo);

              if (validatorList.length === redelegations.validators.length) {
                return callback(null, validatorList);
              }
            }
          });
        }
      } catch (error) {
        return callback("Error fetching validators");
      }
    })
    .catch((_) => {
      return callback("document_not_found");
    });
};
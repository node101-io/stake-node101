const {QueryClient, setupDistributionExtension} = require("@cosmjs/stargate");

const { Tendermint34Client } = require("@cosmjs/tendermint-rpc"); 

function getDelegations(input, callback) {
  
  const delegatorAddressx = "cosmos1nhzfugalfm29htfep7tx3y5fhm8jhks5cy48sl"; 
  const validatorAddressx = "cosmosvaloper1gpx52r9h3zeul45amvcy2pysgvcwddxrgx6cnv";
  const rpcEndpointx = 'https://rpc.cosmos.directory/cosmoshub';

  Tendermint34Client.connect(rpcEndpointx).then((tendermintClient) => {
    const queryClient = QueryClient.withExtensions(tendermintClient, setupDistributionExtension);

    queryClient.distribution.delegationRewards(delegatorAddressx, validatorAddressx).then((rewardsResponse) => {
      const rewards = rewardsResponse.rewards;
      let amountx;
      const uatomRewards = rewards.filter(reward => reward.denom === "uatom");
      uatomRewards.forEach(reward => {
        amountx = parseFloat(reward.amount) / 10e17;
        console.log(reward.amount)
        console.log(`Denom: ${reward.denom}, Amount: ${amountx}`);
      });
    });
  }
  ).catch(_ => {
    return callback('document_not_found');
  });
}



getDelegations("", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
})
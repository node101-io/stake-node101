const fetch = require('node-fetch');

const COMMISION_RATE = 0.05;
function fetchDataFromRestApi(url, callback) {
  fetch(url)
    .then(res => res.json())
    .then(res => callback(null, res))
    .catch(err => callback("rest_api_error"));
};

function getAprRelatedInfoFromApi(url, callback) {
  fetchDataFromRestApi(`${url}` + "/cosmos/mint/v1beta1/annual_provisions", (err, res) => {
    if (err)
      return callback(err)

    const annual_provisions = res.annual_provisions;

    fetchDataFromRestApi(`${url}` + "/cosmos/mint/v1beta1/params", (err, res) => {
      if (err)
        return callback(err)

      const blocks_per_year = res.params.blocks_per_year;

      fetchDataFromRestApi(`${url}` + "/cosmos/mint/v1beta1/inflation", (err, res) => {
        if (err)
          return callback(err)

        const inflation = res.inflation;

        fetchDataFromRestApi(`${url}` + "/cosmos/staking/v1beta1/pool", (err, res) => {
          if (err)
            return callback(err)

          const bonded_tokens = res.pool.bonded_tokens;

          fetchDataFromRestApi(`${url}` + "/cosmos/distribution/v1beta1/params", (err, res) => {
            if (err)
              return callback(err)

            const community_tax = res.params.community_tax;

            return callback(null,{
              annual_provisions,
              blocks_per_year,
              inflation,
              bonded_tokens,
              community_tax
            });
          });
        });
      });
    });
  });
};

function calculateNominalAPR(annual_provisions, community_tax, bonded_tokens) {
  return annual_provisions * (1 - community_tax) / bonded_tokens;
};

function getBlocksPerYear(url, callback) {
  fetchDataFromRestApi(`${url}` + "/cosmos/base/tendermint/v1beta1/blocks/latest", (err, res) => {
    if (err)
      return callback(err);

    const block1 = res.block.header;
    const blockRange = Number(res.block.header.height) > 10000 ? 10000 : 1;

    fetchDataFromRestApi(`${url}` + "/cosmos/base/tendermint/v1beta1/blocks/" + Number(block1.height - blockRange), (err, res) => {
      if (err)
        return callback(err);

      const block2 = res.block.header;
      const yearMiliseconds = 31536000000;
      const blockMiliseconds = (new Date(block1.time) - new Date(block2.time)) / blockRange;

      return callback(null, Math.ceil(yearMiliseconds / blockMiliseconds));
    });
  });
}

function calculateRealAPR(annual_provisions, blocks_per_year, nominalAPR, blocksYearReal) {

  const blockProvision = annual_provisions / blocks_per_year;
  const realProvision = blockProvision * blocksYearReal;

  return nominalAPR * (realProvision / annual_provisions);
}

module.exports = (api_url, callback) => {
  getAprRelatedInfoFromApi(api_url, (err, res) => {
  
    if (err)
      return callback(err)

    const { annual_provisions, blocks_per_year, inflation, bonded_tokens, community_tax } = res;
    getBlocksPerYear(api_url, (err, blocksYearReal) => {
      if (err)
        return callback(err);

      const nominalAPR =  calculateNominalAPR(annual_provisions, community_tax, bonded_tokens);
      const actualAPR = calculateRealAPR(annual_provisions, blocks_per_year, nominalAPR, blocksYearReal) * 100 ;
      console.log(actualAPR);
      return callback(null,(actualAPR * (1- COMMISION_RATE)).toFixed(2));
    });
  });
}




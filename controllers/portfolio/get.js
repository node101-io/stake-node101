const ChainInfo = require('../../models/ChainInfo/ChainInfo');
const getRedelegationList = require('../../models/ChainInfo/functions/getRedelgationList');

const DEFAULT_CHAIN_ID = 'cosmoshub-4';

module.exports = (req, res) => {

  const chain_id =  DEFAULT_CHAIN_ID;

  ChainInfo.getListOfToken({ is_active: true }, (err, listOfToken) => {
    if (err)
      return console.error(err);
    
    ChainInfo.findChainInfoByChainId(chain_id, (err, chainInfo) => {
      if (err)
        return console.error(err);

      const address = 'cosmos1nhzfugalfm29htfep7tx3y5fhm8jhks5cy48sl';
      const rpcEndPoint = 'https://rpc.cosmos.directory/cosmoshub';
      const stakingDenom = 'uatom';
       const redelegations = [
        {
          operatorAddress: 'cosmosvaloper1gpx52r9h3zeul45amvcy2pysgvcwddxrgx6cnv',
          moniker: 'StakeLab.zone',
          identity: 'F12B081334CBE0C6',
          picture: 'https://s3.amazonaws.com/keybase_processed_uploads/63585765d299338807f158d6aadd2e05_360_360.jpg'
        },
        {
          operatorAddress: 'cosmosvaloper1gpx52r9h3zeul45amvcy2pysgvcwddxrgx6cnv',
          moniker: 'StakeLab.zone',
          identity: 'F12B081334CBE0C6',
          picture: 'https://s3.amazonaws.com/keybase_processed_uploads/63585765d299338807f158d6aadd2e05_360_360.jpg'
        },
        {
          operatorAddress: 'cosmosvaloper106yp7zw35wftheyyv9f9pe69t8rteumjrx52jg',
          moniker: 'Bro_n_Bro',
          identity: '97EE2A4FADFB1524',
          picture: 'https://s3.amazonaws.com/keybase_processed_uploads/480af33de764633484defc284813c905_360_360.jpg'
        }
      ] 
/*          getRedelegationList( address, rpcEndPoint, stakingDenom, (err, redelegations) => {
        if (err)
          return console.error(err);    */
        return res.render('index/portfolio', {
          page: 'index/portfolio',
          title: res.__('For you to make most of the distributed value'),
          includes: {
            external: {
              css: ['general', 'header', 'sidebar', 'stake', 'page'],
              js: ['cosmjs','header', 'stake', 'general','cosmjsFunctions', 'page', 'serverRequest']
            },
            meta: {
              title: res.__('For you to make most of the distributed value'),
              description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
              image: '/res/images/open-graph/header.png',
              twitter: true
            },
          },
          chainInfo: chainInfo,
          listOfToken: listOfToken,
          redelegations: redelegations,
          currentChainKey: req.session.currentChainKey || DEFAULT_CHAIN_ID,
          globalAddressKey: req.session.globalAddressKey,
          globalBalanceKey: req.session.globalBalanceKey,
        }); 
      });
    });
/*    });  */  
}
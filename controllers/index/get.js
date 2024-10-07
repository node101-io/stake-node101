const ChainInfo = require('../../models/ChainInfo/ChainInfo');

const DEFAULT_CHAIN_ID = 'cosmoshub-4';

module.exports = (req, res) => {

  const chain_id = req.session.currentChainKey || DEFAULT_CHAIN_ID;

  ChainInfo.getListOfToken({ is_active: true }, (err, listOfToken) => {
    if (err)
      return console.error(err);

    ChainInfo.findChainInfoByChainId(chain_id, (err, chainInfo) => {
      if (err)
        return res.json({ error: err });
      
      return res.render('index/index', {
        page: 'index/index',
        title: res.__('For you to make most of the distributed value'),
        includes: {
          external: {
            css: ['general', 'header', 'sidebar', 'stake', 'page'],
            js: ['cosmjs','header', 'stake','cosmjsFunctions', 'page', 'serverRequest']
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
        currentChainKey: req.session.currentChainKey || DEFAULT_CHAIN_ID,
        globalAddressKey: req.session.globalAddressKey,
        globalBalanceKey: req.session.globalBalanceKey
      });
    });
  });
};

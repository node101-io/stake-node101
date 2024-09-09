const ChainInfo = require('../../models/ChainInfo/ChainInfo');
const serverRequest = require('../../models/ChainInfo/functions/serverRequest');
module.exports = (req, res) => {

  let chain_id = 'cosmoshub-4'
  data = ['currentChainKey', 'globalAddressKey', 'globalBalanceKey']
  items = {}

  data.forEach(key => {
    if (!key || typeof key != 'string' || !key.trim().length)
      return;

    items[key.trim()] = req.session[key.trim()];
  });

  if (items['currentChainKey']) {
      chain_id = items['currentChainKey'];
  }
  
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
            js: ['cosmjs', 'page', 'serverRequest']
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
        session: items
      });
    });
  });
}
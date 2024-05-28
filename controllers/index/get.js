const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chainId = req.query.chainid && typeof req.query.chainid == 'string' ? req.query.chainId : "cosmoshub-4";

  ChainInfo.findChainInfoByChainId(chainId, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    return res.render('index/index', {
      chainInfo: chainInfo,
      page: 'index/index',
      title: res.__('For you to make most of the distributed value'),
      includes: {
        external: {
          css: ['general', 'header', 'page'],
          js: ['page', 'serverRequest', 'cosmjs']
        },
        meta: {
          title: res.__('For you to make most of the distributed value'),
          description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
          image: '/res/images/open-graph/header.png',
          twitter: true
        }
      },
    });
  })
}

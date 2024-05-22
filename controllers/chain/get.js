const ChainInfo = require('../../models/ChainInfo/ChainInfo');

module.exports = (req, res) => {
  const chainId = req.query.chainId; // TODO: what if chainId is not provided?,

  ChainInfo.findChainInfoByChainId(chainId, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    let chain = JSON.parse(chainInfo.chain_info); // TODO: jsonify diye bir js/functions içine yaz, get.js'te de includes.external.js içine ekle
    // function jsonify(data) {
    //   try {
    //     return JSON.parse(data || '{}');
    //   } catch (err) {
    //     console.log(err);
    //     return null;
    //   };
    // };

    const cname = (chain.chainName).toLowerCase().replace(/\s+/g, ''); // TODO: chain_registry_identifier

    return res.json({
      chainInfo: chainInfo,
    });

    // chain.rpc = `https://rpc.cosmos.directory/${cname}`;

    // return res.render('index/index', {
    //   chainName: (chain).chainName,
    //   tokenName: (chain).currencies[0].coinDenom,
    //   chainInfo: JSON.stringify(chain),
    //   validatorAddress: chainInfo.validator_address,
    //   page: 'index/index',
    //   title: res.__('For you to make most of the distributed value'),
    //   includes: {
    //     external: {
    //       css: ['general', 'header', 'page'],
    //       js: ['page', 'serverRequest', 'cosmjs']
    //     },
    //     meta: {
    //       title: res.__('For you to make most of the distributed value'),
    //       description: res.__('World is changing, and there are a lot of new values emerging with blockchain technology. Now, it is the time to _distribute_ the value. node101 is validating and distributing the value in more than 15 blockchains, all with different visions for their community. To discover and learn more how you can join the distributed ecosystem, reach out at hello@node101.io.'),
    //       image: '/res/images/open-graph/header.png',
    //       twitter: true
    //     }
    //   },
    // });

  })
}

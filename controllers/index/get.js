const ChainInfo = require('../../models/ChainInfo/ChainInfo');

const listOfToken = {
  "cosmoshub": {
    "chainId": "cosmoshub-4",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/chain.png",
  },
  "agoric": {
    "chainId": "agoric-3",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/chain.png",
  },
  "celestia": {
    "chainId": "celestia",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/celestia/chain.png",
  },/*
  "laozi-mainnet": {
    "chainId": "laozi-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/laozi-mainnet/chain.png",
  },
  "canto": {
    "chainId": "canto_7700",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/canto_7700/chain.png",
  },
  "shentu": {
    "chainId": "shentu-2.2",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/shentu-2.2/chain.png",
  },
  "irisnet": {
    "chainId": "irishub",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/irishub/chain.png",
  },
  "cheqd": {
    "chainId": "cheqd-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cheqd-mainnet/chain.png",
  },
  "composable": {
    "chainId": "centauri",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/centauri/chain.png",
  },
  "kyve": {
    "chainId": "kyve",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/kyve/chain.png",
  },
  "umee": {
    "chainId": "umee",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/umee/chain.png",
  },
  "assetmantle": {
    "chainId": "mantle",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/mantle/chain.png",
  },
  "desmos": {
    "chainId": "desmos-mainnet",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/desmos-mainnet/chain.png",
  },
  "emoney": {
    "chainId": "emoney",
    "imgUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/emoney/chain.png",
  }, */
};

module.exports = (req, res) => {
  const chainId = "cosmoshub-4"
  ChainInfo.findChainInfoByChainId(chainId, (err, chainInfo) => {
    if (err)
      return res.json({ error: err });

    return res.render('index/index', {
      chainInfo: chainInfo,
      listOfToken: listOfToken,
      test: 1,
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

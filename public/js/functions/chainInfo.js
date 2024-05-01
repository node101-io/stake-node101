const chains = {
  // "theta-testnet-001": {
  //   chainId: "theta-testnet-001",
  //   chainName: "Cosmos Hub Testnet",
  //   rpc: "https://rpc.sentry-01.theta-testnet.polypore.xyz",
  //   rest: "https://rest.sentry-01.theta-testnet.polypore.xyz",
  //   bip44: {
  //     coinType: 118,
  //   },
  //   bech32Config: {
  //     bech32PrefixAccAddr: "cosmos",
  //     bech32PrefixAccPub: "cosmospub",
  //     bech32PrefixValAddr: "cosmosvaloper",
  //     bech32PrefixValPub: "cosmosvaloperpub",
  //     bech32PrefixConsAddr: "cosmosvalcons",
  //     bech32PrefixConsPub: "cosmosvalconspub",
  //   },
  //   currencies: [
  //     {
  //       coinDenom: "ATOM",
  //       coinMinimalDenom: "uatom",
  //       coinDecimals: 6,
  //       coinGeckoId: "cosmos"
  //     }
  //   ],
  //   feeCurrencies: [
  //     {
  //       coinDenom: "ATOM",
  //       coinMinimalDenom: "uatom",
  //       coinDecimals: 6,
  //       coinGeckoId: "cosmos",
  //       gasPriceStep: {
  //         low: 0.01,
  //         average: 0.02,
  //         high: 0.1,
  //       },
  //     }
  //   ],
  //   stakeCurrency: {
  //     coinDenom: "ATOM",
  //     coinMinimalDenom: "uatom",
  //     coinDecimals: 6,
  //     coinGeckoId: "cosmos",
  //   },
  //   coinType: 118,

  // },
  "cosmoshub": {
    "bech32Config": {
      "bech32PrefixAccAddr": "cosmos",
      "bech32PrefixAccPub": "cosmospub",
      "bech32PrefixConsAddr": "cosmosvalcons",
      "bech32PrefixConsPub": "cosmosvalconspub",
      "bech32PrefixValAddr": "cosmosvaloper",
      "bech32PrefixValPub": "cosmosvaloperpub"
    },
    "bip44": {
      "coinType": 118
    },
    "chainId": "cosmoshub-4",
    "chainName": "Cosmos Hub",
    "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/chain.png",
    "currencies": [
      {
        "coinDecimals": 6,
        "coinDenom": "ATOM",
        "coinGeckoId": "cosmos",
        "coinMinimalDenom": "uatom",
        "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png"
      }
    ],
    "features": [],
    "feeCurrencies": [
      {
        "coinDecimals": 6,
        "coinDenom": "ATOM",
        "coinGeckoId": "cosmos",
        "coinMinimalDenom": "uatom",
        "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png",
        "gasPriceStep": {
          "average": 0.025,
          "high": 0.03,
          "low": 0.005
        }
      }
    ],
    "rest": "https://lcd-cosmoshub.keplr.app",
    "rpc": "https://cosmos-rpc.publicnode.com:443",
    "stakeCurrency": {
      "coinDecimals": 6,
      "coinDenom": "ATOM",
      "coinGeckoId": "cosmos",
      "coinMinimalDenom": "uatom",
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png"
    },
    "walletUrlForStaking": "https://wallet.keplr.app/chains/cosmos-hub",
    "validator_address": "cosmosvaloper1lrzxwu4dmy8030waevcpft7rpxjjz26cpzvumd"
  },
  "agoric": {
    "rpc": "https://agoric-rpc.polkachu.com:443",
    "rest": "https://lcd-agoric.keplr.app",
    "chainId": "agoric-3",
    "chainName": "Agoric",
    "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/chain.png",
    "stakeCurrency": {
      "coinDenom": "BLD",
      "coinMinimalDenom": "ubld",
      "coinDecimals": 6,
      "coinGeckoId": "agoric",
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/ubld.png"
    },
    "walletUrl": "https://wallet.keplr.app/chains/agoric",
    "walletUrlForStaking": "https://wallet.keplr.app/chains/agoric",
    "bip44": {
      "coinType": 564
    },
    "bech32Config": {
      "bech32PrefixAccAddr": "agoric",
      "bech32PrefixAccPub": "agoricpub",
      "bech32PrefixValAddr": "agoricvaloper",
      "bech32PrefixValPub": "agoricvaloperpub",
      "bech32PrefixConsAddr": "agoricvalcons",
      "bech32PrefixConsPub": "agoricvalconspub"
    },
    "currencies": [
      {
        "coinDenom": "BLD",
        "coinMinimalDenom": "ubld",
        "coinDecimals": 6,
        "coinGeckoId": "agoric",
        "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/ubld.png"
      },
      {
        "coinDenom": "IST",
        "coinMinimalDenom": "uist",
        "coinDecimals": 6,
        "coinGeckoId": "inter-stable-token",
        "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/uist.png"
      }
    ],
    "feeCurrencies": [
      {
        "coinDenom": "BLD",
        "coinMinimalDenom": "ubld",
        "coinDecimals": 6,
        "coinGeckoId": "agoric",
        "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/agoric/ubld.png",
        "gasPriceStep": {
          "low": 0.03,
          "average": 0.05,
          "high": 0.07
        }
      },
      {
        "coinDenom": "IST",
        "coinMinimalDenom": "uist",
        "coinDecimals": 6,
        "coinGeckoId": "inter-stable-token",
        "gasPriceStep": {
          "low": 0.0034,
          "average": 0.007,
          "high": 0.02
        }
      }
    ],
    "features": [],
    "alternativeBIP44s": [
      {
        "coinType": 118
      }
    ],
    "validator_address": "agoricvaloper1k334nqagmmxajt32hdtxrpnsavz0njwa3mtcqc"
  },
  // "celestia": celestia,
  // "irisnet": irisnet,
  // "cheqd": cheqd,
  // "kyve": kyve,
  // "ux": ux,
  // "assetmantle": assetmantle,
  // "desmos": desmos,
  // "emoney": emoney,
  // "crescent": crescent,
  // "neutron": neutron,
  // "stride": stride,
  // "oraichain": oraichain,
  // "fxcore": fxcore,
  // "canto": canto,
  // "shentu": shentu,
  // "composable": composable,
  // "bandchain": bandchain,
};
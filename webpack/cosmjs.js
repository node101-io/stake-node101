const { SigningStargateClient } = require('@cosmjs/stargate');
const { StargateClient } = require("@cosmjs/stargate")
const { QueryClient, setupDistributionExtension, setupStakingExtension} = require("@cosmjs/stargate");


const { MsgDelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgBeginRedelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgUndelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgWithdrawDelegatorReward } = require('cosmjs-types/cosmos/distribution/v1beta1/tx');

const { Tendermint34Client } = require("@cosmjs/tendermint-rpc");


const  { AuthInfo, Fee, TxBody, TxRaw, SignerInfo } = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const { SignMode } = require("cosmjs-types/cosmos/tx/signing/v1beta1/signing");
const { PubKey } = require("cosmjs-types/cosmos/crypto/secp256k1/keys");


const Long = require("long");
const Base64  = require('crypto-js/enc-base64');
const Hex  = require('crypto-js/enc-hex');
const { Buffer } = require('buffer');


window.StargateClient = StargateClient;
window.Tendermint34Client = Tendermint34Client;
window.QueryClient = QueryClient;
window.SigningStargateClient = SigningStargateClient;
window.MsgDelegate = MsgDelegate;
window.MsgBeginRedelegate = MsgBeginRedelegate;
window.MsgUndelegate = MsgUndelegate;
window.setupDistributionExtension = setupDistributionExtension;
window.setupStakingExtension = setupStakingExtension;
window.MsgWithdrawDelegatorReward = MsgWithdrawDelegatorReward;

window.Buffer = Buffer;
window.Base64 = Base64;
window.Hex = Hex;
window.Long = Long;

window.AuthInfo = AuthInfo;
window.Fee = Fee;
window.TxBody = TxBody;
window.TxRaw = TxRaw;
window.SignerInfo = SignerInfo;
window.SignMode = SignMode;
window.PubKey = PubKey;
// window.MsgDelegate = MsgDelegate;
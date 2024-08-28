const { SigningStargateClient } = require('@cosmjs/stargate');
const { MsgDelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgBeginRedelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');

window.SigningStargateClient = SigningStargateClient;
window.MsgDelegate = MsgDelegate;
window.MsgBeginRedelegate = MsgBeginRedelegate
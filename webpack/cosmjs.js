const { SigningStargateClient } = require('@cosmjs/stargate');
const { MsgDelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgBeginRedelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsgUndelegate } = require('cosmjs-types/cosmos/staking/v1beta1/tx');
const { MsMsgWithdrawDelegatorReward } = require('cosmjs-types/cosmos/distribution/v1beta1/tx');

const { QueryClient, setupDistributionExtension, setupStakingExtension} = require("@cosmjs/stargate");
const { Tendermint34Client } = require("@cosmjs/tendermint-rpc");
const { StargateClient } = require("@cosmjs/stargate")



window.StargateClient = StargateClient;
window.Tendermint34Client = Tendermint34Client;
window.QueryClient = QueryClient;
window.SigningStargateClient = SigningStargateClient;
window.MsgDelegate = MsgDelegate;
window.MsgBeginRedelegate = MsgBeginRedelegate;
window.MsgUndelegate = MsgUndelegate;
window.setupDistributionExtension = setupDistributionExtension;
window.setupStakingExtension = setupStakingExtension;
window.MsMsgWithdrawDelegatorReward = MsMsgWithdrawDelegatorReward;
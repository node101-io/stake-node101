const { AuthInfo, Fee, TxBody, TxRaw, SignerInfo } = require("../public/js/functions/proto/gen/tx");
const  { AuthInfo, Fee, TxBody, TxRaw, SignerInfo } = require("")
const { SignMode } = require("../public/js/functions/proto/gen/signing");
const { PubKey } = require("../public/js/functions/proto/gen/keys");



window.TxBody = TxBody;
window.TxRaw = TxRaw;
window.AuthInfo = AuthInfo;
window.Fee = Fee;
window.SignerInfo = SignerInfo;
window.SignMode = SignMode;
window.PubKey = PubKey;

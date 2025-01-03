
function connect(network) {
    return new Promise(async (resolve, reject) => {
        try {
            await keplr.experimentalSuggestChain(network);
            await keplr.enable(network.chainId);

            resolve({ success: true });
        } catch (error) {
            reject({ success: false, message: error.message });
        }
    });
}

function disconnect() {
    if (keplr.disconnect) keplr.disconnect();
    if (keplr.disable) keplr.disable();
}

function getAccounts(network) {
    return new Promise(async (resolve, reject) => {
        try {
            const offlineSigner = keplr.getOfflineSigner(network.chainId);
            const accounts = await offlineSigner.getAccounts();
            resolve(accounts);
        } catch (error) {
            reject(error.message);
        }
    });
}

function buildPayForBlob(tx, blob) {
    let blobTx = new proto.BlobTx();
    blobTx.setTx(tx);
    blobTx.setTypeId("BLOB");
    blobTx.addBlobs(blob);
    return blobTx.serializeBinary();
}

async function sendPayForBlob(network, sender, proto, fee, blob) {
    const account = await fetchAccountInfo(network, sender);
    const { pubKey } = await keplr.getKey(network.chainId);

    const tx = TxBody.encode(
        TxBody.fromPartial({
            messages: proto,
            memo: "Sent via Celenium.io",
        }),
    ).finish();

    if (account) {
        const signDoc = {
            bodyBytes: tx,
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    {
                        publicKey: {
                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            value: PubKey.encode({
                                key: pubKey,
                            }).finish(),
                        },
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    },
                ],
                fee: Fee.fromPartial({
                    amount: fee.amount.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                    gasLimit: fee.gas,
                }),
            }).finish(),
            chainId: network.chainId,
            accountNumber: Long.fromString(account.account_number),
        };

        const signed = await keplr.signDirect(network.chainId, sender, signDoc);

        const body = buildPayForBlob(
            TxRaw.encode({
                bodyBytes: signed.signed.bodyBytes,
                authInfoBytes: signed.signed.authInfoBytes,
                signatures: [decodeSignature(signed.signature.signature)],
            }).finish(),
            blob,
        );

        const signedTx = {
            tx: body,
            signDoc: signed.signed,
        };

        const txHash = await broadcastTxSync(network.chainId, signedTx.tx);
        return Buffer.from(txHash).toString("hex");
    }
}

async function simulateMsgs(network, sender, proto, fee) {
    const account = await fetchAccountInfo(network, sender);

    if (account) {
        const unsignedTx = TxRaw.encode({
            bodyBytes: TxBody.encode(
                TxBody.fromPartial({
                    messages: proto,
                    memo: "",
                }),
            ).finish(),
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    SignerInfo.fromPartial({
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    }),
                ],
                fee: Fee.fromPartial({
                    amount: fee.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                }),
            }).finish(),
            signatures: [new Uint8Array(64)],
        }).finish();

        const simulatedResult = await $fetch(`${network.rest}/cosmos/tx/v1beta1/simulate`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                tx_bytes: Buffer.from(unsignedTx).toString("base64"),
            }),
        });

        const gasUsed = parseInt(simulatedResult.gas_info.gas_used);
        if (Number.isNaN(gasUsed)) {
            throw new Error(`Invalid integer gas: ${simulatedResult.gas_info.gas_used}`);
        }

        return gasUsed * 1.2;
    }

    return undefined;
}

async function sendMsgs(network, sender, proto, fee) {
    const chainName = network.chainName.toLowerCase().replace(/\s/g, "");
    // also trim out if there is a space inside the chain name

    console.log(network);
    const restUrl = `https://rest.cosmos.directory/${chainName}`;
    const account = await fetchAccountInfo(restUrl, sender);
    const { pubKey } = await keplr.getKey('celestia');

   
    const tx = TxBody.encode(
        TxBody.fromPartial({
            messages: proto,
            memo: "Sent via node101.io",
        }),
    ).finish();


    if (account) {
        
        const signDoc = {
            bodyBytes: tx,
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    {
                        publicKey: {
                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            value: PubKey.encode({
                                key: pubKey,
                            }).finish(),
                        },
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_DIRECT,
                            },
                            multi: undefined,
                        },
                        sequence: account.sequence,
                    },
                ],
                fee: Fee.fromPartial({
                    amount: fee.amount.map((coin) => {
                        return {
                            denom: coin.denom,
                            amount: coin.amount.toString(),
                        };
                    }),
                    gasLimit: fee.gas,
                }),
            }).finish(),
            chainId: network.chainId,
           accountNumber: Long.fromString(account.account_number),
        };


        const signed = await keplr.signDirect(network.chainId, sender, signDoc);

        const signedTx = {
            tx: TxRaw.encode({
                bodyBytes: signed.signed.bodyBytes,
                authInfoBytes: signed.signed.authInfoBytes,
                signatures: [decodeSignature(signed.signature.signature)],
            }).finish(),
            signDoc: signed.signed,
        };
     
        console.log(Buffer.from(signedTx.tx).toString("hex"));
        const txHash = await broadcastTxSync(network.chainId, signedTx.tx);
        return Buffer.from(txHash).toString("hex");
    }
}

async function fetchAccountInfo(rest, address) {
  
    try {
        const uri = `${rest}/cosmos/auth/v1beta1/accounts/${address}`;
        console.log(uri);
        const response = await fetch(uri);
        const data = await response.json();
        return data.account;
    } catch (e) {
        return undefined;
    }
}

async function broadcastTxSync(chainId, tx) {
    return keplr.sendTx(chainId, tx, "sync");
}

function fromHexString(hexString) {
    return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

function decodeSignature(s) {
    return fromHexString(Base64.parse(s).toString(Hex));
}

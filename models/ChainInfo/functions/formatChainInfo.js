module.exports = (chainInfo, callback) => {
  if (!chainInfo || !chainInfo._id)
    return callback('document_not_found');

  return callback(null, {
    _id: chainInfo._id.toString(),
    chain_id: chainInfo.chain_id,
    chain_keplr_identifier: chainInfo.chain_keplr_identifier,
    chain_registry_identifier: chainInfo.chain_registry_identifier,
    rpc_url: chainInfo.rpc_url,
    img_url: chainInfo.img_url,
    chain_info: chainInfo.chain_info,
    validator_address: chainInfo.validator_address,
    is_active: chainInfo.is_active,
  });
};
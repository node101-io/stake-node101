module.exports = (chainInfo, callback) => {
  if (!chainInfo || !chainInfo._id)
    return callback('document_not_found');

  return callback(null, {
    _id: chainInfo._id.toString(),
    chain_id: chainInfo.chain_id,
    rpc_url: chainInfo.rpc_url,
    chain_info: chainInfo.chain_info,
    validator_address: chainInfo.validator_address,
    is_active: chainInfo.is_active,
  });
};
module.exports = (validtorInfo, callback) => {
  if (!validtorInfo || !validtorInfo._id)
    return callback('document_not_found');

  return callback(null, {
    _id: validtorInfo._id.toString(),
    valiatorInfo_id: validtorInfo._id,
    image_url: validtorInfo.image_url,
  });
};
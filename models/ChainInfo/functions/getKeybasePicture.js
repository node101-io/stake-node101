const fetch = require('node-fetch');

module.exports = (keybase_id, callback) =>  {
  fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${keybase_id}&fields=pictures`)
    .then(res => res.json())
    .then(res => {
      if (!res)
        return callback('document_not_found');
      res = res.them[0].pictures.primary.url;
      return callback(null, res);
    })
    .catch(err => {
      console.log(err);
      return callback('network_error');
    });
};



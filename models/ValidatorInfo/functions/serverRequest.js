const fetch = require('node-fetch');

module.exports = (identifier, reqBody, callback) => {

  fetch(identifier, {
    method: 'POST', // Use POST method to send data
    headers: {
      'Content-Type': 'application/json', // Ensure the server knows it's JSON data
    },
    body: JSON.stringify(reqBody), // Send req.body as the request body
  })
    .then(res => {
      return res.json()
    })
    .then(res => {

      if (!res) {
        return callback('document_not_found');
      }
      return callback(null, res);
    })
    .catch(_ => {
      return callback('document_not_found');
    });
};
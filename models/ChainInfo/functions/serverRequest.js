const fetch = require('node-fetch');

module.exports = (identifier, reqBody, callback) => {
  console.log("11x")
  fetch(identifier, {
    method: 'POST', // Use POST method to send data
    headers: {
      'Content-Type': 'application/json', // Ensure the server knows it's JSON data
    },
    body: JSON.stringify(reqBody), // Send req.body as the request body
  })
    .then(res => {
      console.log("15", res);
      return res.json()
    })
    .then(res => {
      console.logg("12x")

      if (!res) {
        return callback('document_not_found');
      }
      return callback(null, res);
    })
    .catch(_ => {
      console.log("13x")
      return callback('document_not_found');
    });
};
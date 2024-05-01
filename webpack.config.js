const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    entry: './webpack/cosmjs.js',
    output: {
      path: path.join(__dirname, 'public/js/functions'),
      filename: 'cosmjs.js',
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    }
  },
];
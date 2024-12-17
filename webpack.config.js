const path = require("path");
const webpack = require("webpack");

module.exports = [
  {
    entry: {
      cosmjs: "./webpack/cosmjs.js", // Entry point for cosmjs
      protojs: "./webpack/protojs.js", // Entry point for protojs
    },
    output: {
      path: path.join(__dirname, "public/js/functions"), // Output folder
      filename: "[name].js", // Dynamically generates 'cosmjs.js' and 'protojs.js'
      library: "[name]", // Expose the library globally under the same name as entry
      libraryTarget: "umd", // Support for CommonJS, AMD, and browser
      globalObject: "this", // Ensures compatibility across environments
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Match TypeScript files
          use: "ts-loader", // Use ts-loader to compile TS
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      fallback: {
        buffer: false,
        crypto: false,
        events: false,
        path: false,
        stream: false,
        string_decoder: false,
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"], // Provide Buffer globally
        Long: ["long", "Long"], // Provide Long globally
       
        

      }),
    ],
  },
];

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

fs.copyFileSync('../src/index.js', './prevent-import-loader.js')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js?)$/,
        use: [
          {
            loader: './prevent-import-loader.js',
            options: {
              commentKeywords: {
                '@only-import-in-pc': process.env.DEVICE === 'mobile',
                '@only-import-in-mobile': process.env.DEVICE === 'pc',
              },
              parserPlugins: [],
            },
          },
        ],
        exclude: /node_modules/,
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
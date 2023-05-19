const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/example/index.ts',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: [
          {
            loader: './src/prevent-import-loader.js',
            options: {
              commentKeywords: {
                '@prevent-import-in-mobile': process.env.DEVICE === 'mobile',
                '@prevent-import-in-pc': process.env.DEVICE === 'pc',
              },
              parserPlugins: [],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
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
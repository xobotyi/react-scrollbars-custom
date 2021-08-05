/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
};

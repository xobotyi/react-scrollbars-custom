const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const RSC_PACKAGE = require("react-scrollbars-custom/package");

module.exports = {
  target: "web",
  entry: {
    "dist/js/bundle.js": path.join(__dirname, "src", "js", "index.jsx"),
    "dist/css/style": path.join(__dirname, "src", "scss", "style.scss")
  },
  output: {
    path: __dirname,
    filename: "[name]",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ],
    noEmitOnErrors: true
  },
  devServer: {
    contentBase: __dirname,
    disableHostCheck: true,
    port: 3030
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      RSC_VERSION: JSON.stringify(RSC_PACKAGE.version),
      RSC_NAME: JSON.stringify(RSC_PACKAGE.name),
      RSC_HOMEPAGE: JSON.stringify(RSC_PACKAGE.homepage),
      RSC_AUTHOR: JSON.stringify(RSC_PACKAGE.author)
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            comments: true,
            cacheDirectory: false,
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "58",
                    ie: "9"
                  },
                  useBuiltIns: "entry",
                  corejs: 3
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-proposal-class-properties"],
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  }
};

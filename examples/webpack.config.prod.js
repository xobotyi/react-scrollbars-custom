const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanDirWebpackPlugin = require("cleandir-webpack-plugin");

const distPath = path.join(__dirname, "/static");

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    "bundle.js": path.join(__dirname, "/app/app.js"),
    style: path.join(__dirname, "/app/style.scss")
  },
  output: {
    path: distPath,
    filename: "[name]",
    publicPath: "/"
  },
  resolve: {
    alias: {
      "react-scrollbars-custom": path.join(__dirname, "..", "src")
    },
    extensions: [".js"]
  },
  optimization: {
    minimize: true,
    noEmitOnErrors: true,
    nodeEnv: "production"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CleanDirWebpackPlugin(path.join(distPath, "/style"), { stage: "after" })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            sourceMaps: false,
            comments: true,
            cacheDirectory: false,
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: 58
                  }
                }
              ]
            ],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }
};

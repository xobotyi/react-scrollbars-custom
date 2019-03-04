const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dist = path.join(__dirname, "dist");

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    "dist/bundle.js": path.join(__dirname, "app/index.tsx")
  },
  output: {
    path: dist,
    filename: "[name]",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  optimization: {
    minimize: false,
    noEmitOnErrors: true,
    nodeEnv: "production"
  },
  devServer: {
    contentBase: dist,
    port: 3000,
    compress: true,
    open: true,
    progress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "/app/index.html"),
      inject: false
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};

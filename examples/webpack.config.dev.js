const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const distPath = path.join(__dirname, "/static");

module.exports = {
    mode: "development",
    target: "web",
    entry: {
        "static/bundle.js": path.join(__dirname, "/app/app.tsx"),
        "static/style": path.join(__dirname, "/app/style.scss"),
    },
    output: {
        path: distPath,
        filename: "[name]",
        publicPath: "/",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
        minimize: false,
        noEmitOnErrors: true,
        nodeEnv: "development",
    },
    devServer: {
        contentBase: distPath,
        port: 3000,
        compress: true,
        open: true,
        progress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/index.html"),
            inject: false,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: "html-loader",
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};

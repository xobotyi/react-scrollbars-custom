const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanDirWebpackPlugin = require("cleandir-webpack-plugin");

const distPath = path.join(__dirname, "/static");

module.exports = {
    mode: "production",
    target: "web",
    entry: {
        "bundle.js": path.join(__dirname, "/app/app.ts"),
        style: path.join(__dirname, "/app/style.scss"),
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
        minimize: true,
        noEmitOnErrors: true,
        nodeEnv: "production",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CleanDirWebpackPlugin(path.join(distPath, "/style"), {stage: "after"}),
    ],
    module: {
        rules: [
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

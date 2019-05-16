const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    target: "web",
    entry: {
        "dist/js/bundle.js": path.join(__dirname, 'src', 'js', 'index.jsx'),
        "dist/css/style": path.join(__dirname, 'src', 'scss', 'style.scss'),
    },
    output: {
        path: __dirname,
        filename: "[name]",
        publicPath: "/",
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                                 parallel: true,
                             }),
        ],
        noEmitOnErrors: true,
    },
    devServer: {
        contentBase: __dirname,
        disableHostCheck: true,
        port: 3030,
    },
    plugins: [
        new MiniCssExtractPlugin({
                                     filename: "[name].css",
                                     chunkFilename: "[id].css",
                                 }),
        new webpack.DefinePlugin({
                                     RSC_VERSION: JSON.stringify(require("react-scrollbars-custom/package").version),
                                 }),
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
                                    "targets": {
                                        "chrome": "58",
                                        "ie": "9",
                                    },
                                    useBuiltIns: "entry",
                                    corejs: 3,
                                },
                            ],
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties"],
                            ["@babel/plugin-transform-runtime",
                                {
                                    corejs: 3,
                                }],
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
};
let path = require('path');

module.exports = {
    mode:         "development",
    target:       "web",
    devtool:      'eval',
    entry:        ['webpack-dev-server/client?http://localhost:3000'].concat('./index'),
    watch:        true,
    output:       {
        path:       path.join(__dirname, 'static'),
        filename:   'bundle.js',
        publicPath: '/static/',
    },
    optimization: {
        noEmitOnErrors: true,
    },
    resolve:      {
        alias:      {
            "react-scrollbar-custom": path.join(__dirname, '..', '..', 'src'),
        },
        extensions: ['.js'],
    },
    module:       {
        rules: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                use:     {
                    loader:  "babel-loader",
                    options: {
                        sourceMaps:     false,
                        comments:       false,
                        cacheDirectory: false,
                        presets:        [
                            "stage-0",
                            "react",
                            [
                                "env",
                                {
                                    "targets": {
                                        "chrome": 58,
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },
};
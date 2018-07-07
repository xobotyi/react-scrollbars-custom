let path = require('path');

module.exports = {
    mode:         process.env.NODE_ENV === 'development' ? 'development' : 'production',
    target:       "web",
    entry:        path.join(__dirname, 'index.js'),
    watch:        process.env.NODE_ENV === 'development',
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
            "react-scrollbars-custom": path.join(__dirname, '..', 'src'),
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

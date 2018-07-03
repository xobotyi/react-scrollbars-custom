let webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig    = require('./webpack.config');

new WebpackDevServer(
        webpack(webpackConfig),
        {
            publicPath: webpackConfig.output.publicPath,
            hot:        true,
            stats:      {
                colors: true,
            },
        })
        .listen(3000, 'localhost', function (err) {
            if (err) {
                console.log(err);
            }
            console.log('Listening at localhost:3000');
        });
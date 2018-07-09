const path = require('path');
const webpack = require('webpack');
const widthCoverage = process.env.COVERAGE === 'true';

let coverageRules     = [],
    coverageReporters = [];

if (widthCoverage) {
    coverageRules.push({
                           test:    /\.js$|\.jsx$/,
                           enforce: 'post',
                           use:     {
                               loader:  'istanbul-instrumenter-loader',
                               options: {esModules: true},
                           },
                           exclude: /node_modules|\.spec\.js$/,
                       });
    coverageReporters.push('coverage-istanbul');
}

module.exports = function karmaConfig(config) {
    config.set({
                   browsers:                 ['ChromeHeadless'],
                   singleRun:                true,
                   frameworks:               ['mocha', 'chai'],
                   files:                    ['./test.js'],
                   preprocessors:            {'./test.js': 'webpack'},
                   reporters:                ['mocha'].concat(coverageReporters),
                   webpack:                  {
                       mode:        "development",
                       target:      "web",
                       performance: {hints: false},
                       resolve:     {
                           alias: {
                               'react-scrollbars-custom': path.resolve(__dirname, './src'),
                           },
                       },
                       module:      {
                           rules: [
                                      {
                                          test:    /\.js$/,
                                          exclude: /(node_modules)/,
                                          use:     {
                                              loader:  'babel-loader',
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
                                  ].concat(coverageRules),
                       },
                   },
                   coverageIstanbulReporter: {
                       dir:                   path.join(__dirname, 'coverage'),
                       reports:               ['lcov', 'html'],
                       combineBrowserReports: true,
                       fixWebpackSourcePaths: true,
                       'report-config':       {
                           html: {
                               subdir: 'html',
                           },
                       },
                   },
               });
};

module.exports = (cfg) => {
    cfg.set({
                browsers: ['ChromeHeadless'],

                singleRun: true,

                autoWatch: false,
                logLevel: cfg.LOG_INFO,

                frameworks: ["jasmine", "karma-typescript"],
                reporters: ["progress", "karma-typescript"],
                preprocessors: {
                    '**/*.ts': "karma-typescript",
                    '**/*.tsx': "karma-typescript",
                },

                files: [
                    "./src/**/*.ts",
                    "./src/**/*.tsx",
                    "./tests/**/*.ts",
                    "./tests/**/*.tsx",
                ],

                karmaTypescriptConfig: {
                    compilerOptions: {
                        "target": "es2016",
                        "module": "commonjs",
                        "moduleResolution": "node",
                        "lib": [
                            "dom",
                            "es2016",
                        ],
                    },
                    coverageOptions: {
                        exclude: /\.spec\.tsx?$/i,
                    },
                    reports: {
                        'lcovonly': {
                            "directory": './coverage',
                            "subdirectory": () => "",
                            "filename": 'lcov.info',
                        },
                        'html': {
                            "directory": './coverage',
                            "subdirectory": () => "",
                        },
                    },
                },
            });
};

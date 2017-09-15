const path = require('path');

module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        browsers: ['Chrome'],

        files: [
            'lib/**/*.js',
            'test/**/*.ts',
            'test/**/*.tsx',

            { pattern: '**/*.js.map', included: false }
        ],

        exclude: [],

        preprocessors: {
            '**/*.{ts,tsx}': ['typescript']
        },

        typescriptPreprocessor: {
            options: {
                project: path.resolve('./tsconfig.json'),
                //inlineSourceMap: true,
                //inlineSources: true
            }
        },

        reporters: ['progress'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: true,
        singleRun: false,
        concurrency: 1
    })
}

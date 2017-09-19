const path = require('path');
const webpack = require('webpack');

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
            '**/*.js': ['webpack'],
            '**/*.{ts,tsx}': ['typescript']
        },

        typescriptPreprocessor: {
            options: {
                project: path.resolve('./tsconfig.json'),
                //inlineSourceMap: true,
                //inlineSources: true
            }
        },

        webpack: {
            
        },
        webpackServer: { noInfo: true },

        reporters: ['progress'],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,

        autoWatch: true,
        singleRun: false,
        concurrency: 1
    })
}

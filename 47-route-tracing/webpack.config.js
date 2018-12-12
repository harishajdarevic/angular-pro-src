var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var server = require('webpack-dev-server');
var chalk = require('chalk');
var ts = require('awesome-typescript-loader'); // not in use right now I think.
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var jsonServer = require('json-server');
// var aot = require('@ultimate/aot-loader'); // had to remove b/c breaking.
var cwd = process.cwd();

// also removed
/*
  FROM PLUGIN
  new aot.AotPlugin({
    tsConfig: './tsconfig.json'
  }),

  FROM LOADER for .ts
  loader: '@ultimate/aot-loader'
*/

module.exports = {
    cache: true,
    context: cwd,
    performance: {
        hints: false
    },
    devServer: {
        contentBase: cwd,
        compress: true,
        inline: true,
        hot: true,
        port: 5000,
        publicPath: '/build/',
        quiet: true,
        historyApiFallback: true,
        setup: function (app) {
            app.use('/api', jsonServer.router('db.json'));
        },
        stats: {
            chunks: false,
            chunkModules: false
        }
    },
    devtool: 'sourcemap',
    entry: {
        app: [
            'reflect-metadata',
            'ts-helpers',
            'zone.js',
            'main'
        ]
    },
    output: {
        chunkFilename: '[name].chunk.js',
        filename: '[name].js',
        path: path.resolve(cwd, 'build'),
        publicPath: '/build/',
        sourceMapFilename: '[name].map'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    },
                    {
                        loader: 'angular2-template-loader'
                    }
                ]
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'raw-loader'
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: './',
            manifest: require(path.resolve(cwd, 'vendor/vendor-manifest.json'))
        }),
        new webpack.NamedModulesPlugin(),
        new ProgressBarPlugin({
            format: chalk.magenta.bold('build') + ' [' + chalk.green(':bar')+ '] ' + chalk.green.bold(':percent') + ' ' + chalk.yellow.bold(':elapsed seconds') + ' ' + chalk.white(':msg'),
            clear: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules', cwd]
    }
};
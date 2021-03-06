const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

var srcRoot = './src/';
var dstRoot = './dist/';

var ENV = process.env.npm_lifecycle_event;

var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = {
    devtool: 'source-map',
    entry: {
        polyfills: srcRoot + 'polyfills.ts',
        vendor: srcRoot + 'vendor.ts',
        app: srcRoot + 'main.ts',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    devServer: {
        contentBase: root(dstRoot),
        compress: true,
        port: 9000,
        clientLogLevel: "info"
    }, 
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    'ts-loader',
                    'angular2-template-loader',
                    'angular-router-loader?debug=false'
                ],
                exclude: [/node_modules\/(?!(ng2-.+))/]
            }, {
                test: /\.html$/,
                loader: 'html-loader',
                include: [root(srcRoot, 'app'), root(srcRoot, 'core')]
            }, {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            }, {
                test: /\.(sass|scss)$/,
                loaders: [
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunksSortMode: 'dependency',
            hash: true,
            favicon: srcRoot + 'favicon.ico'
        })
    ]
};

// Helper functions
function root() {
    var args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

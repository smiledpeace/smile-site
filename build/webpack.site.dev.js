const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(config, {
    entry: {
        app: "./doc/main.js"
    },
    devServer: {
        progress: true,
        host: '0.0.0.0',
        stats: 'errors-only'
    },
    output: {
        path: path.join(__dirname, '../doc/dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../doc/views/index.dev.html'), // HTML 模版文件所在的文件路径
            title: 'index.html'
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    watch: true
})
const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');
const { WebPlugin } = require('web-webpack-plugin');

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
        chunkFilename: 'async_[name].js',
        publicPath: '/',
    },
    plugins: [
        new WebPlugin({
            template: path.resolve(__dirname, '../doc/views/index.dev.html'), // HTML 模版文件所在的文件路径
            filename: 'index.html'
        })
    ],
    watch: true
})
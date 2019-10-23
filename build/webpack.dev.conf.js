const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');


const { WebPlugin } = require('web-webpack-plugin');
module.exports = merge(config, {
    entry: {
        app: "./src/main.ts"
    },
    output: {
        path: path.join(__dirname, '../libs'),
        chunkFilename: 'async_[name].js'
    },
    watch: true
})
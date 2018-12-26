'use strict';
const path = require('path');
// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../svgm-html/dist'),
    filename: 'svgm.min.js',
    // libraryTarget: 'umd',
    library: 'svgm'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }
    ]
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: true
  },  
  externals: {
   // 'svg.js':'SVGJS',
    'svgdom':'window'
  },
  node: {
    fs: 'empty'
  }  
};

'use strict';
const path = require('path');
// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
  externals: {
    'svg.js':'SVGJS',
    'svgdom':'window'
  },
  node: {
    fs: 'empty'
  }  
};

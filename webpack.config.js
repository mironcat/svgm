const path = require('path');  
const webpack = require('webpack');

module.exports = {  
  entry: './lib/svgm.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'svgm.min.js',
    libraryTarget: 'umd',
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
  }
}
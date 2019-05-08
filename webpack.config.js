// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {loader: 'html-loader', options: {attrs:false}}, 
          {loader: 'pug-html-loader', options: {pretty:true}}
        ]
      },
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/images/",
              publicPath: '../assets/images/'
            }
          }
        ]
      },
    ]
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss')
    },    
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'app/modules/ABM/list.html',
      template: 'src/app/modules/ABM/list.pug',
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'app/modules/ABM/hola.html',
      template: 'src/app/modules/ABM/hola.pug',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: "scss/[name].css",
    }),    
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'], directory: true }
    }),
    new CopyWebpackPlugin([
      {from:'src/assets/images',to:'assets/images'} 
    ]), 
 ], 
};
module.exports = config;
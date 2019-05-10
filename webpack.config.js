// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',  
  optimization: {
    // it'll minimize after running build
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/fonts/',
            publicPath: '../assets/fonts'
          }
        }]
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
          loader: 'postcss-loader',
          options: {
            ident:'postcss',
            plugins: [
              require('autoprefixer')({}),
            ]
          }
        }
       ]        
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
    ])    
 ], 
};
module.exports = config;
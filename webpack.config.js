// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const fs = require('fs');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',  
  optimization: {
    // it'll minimize after running build
    minimizer: [
      new TerserJSPlugin({}), 
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  module: {
    rules: [
      registerHtmlAndPugLoader(),
      registerFontsLoader(),
      registerCssAndScssLoaders(),
      registerImagesLoader(),
    ]
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss')
    },    
  },
  plugins: buildHtmlPlugins('./src/app/modules', 'app').concat([
    registerHtmlBeautifyPlugin(),
    registerCssExtractPlugin(), 
    registerBrowserSyncPlugin(),
    registerWebPackCopyPlugin()
 ]), 
};
module.exports = config;

function registerHtmlBeautifyPlugin() {
  return new HtmlBeautifyPlugin();
}

function registerCssExtractPlugin() {
  return new MiniCssExtractPlugin({
    filename: "scss/[name].css"
  });
}

function registerWebPackCopyPlugin() {
  return new CopyWebpackPlugin([
    { from: 'src/assets/images', to: 'assets/images' }
  ]);
}

function registerBrowserSyncPlugin() {
  return new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    server: { baseDir: ['dist'], directory: true }
  });
}

function registerImagesLoader() {
  return {
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
  };
}

function registerCssAndScssLoaders() {
  return {
    test: /\.(css|scss)$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          require('autoprefixer')({}),
        ]
      }
    }
    ]
  };
}

function registerFontsLoader() {
  return {
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/fonts/',
        publicPath: '../assets/fonts'
      }
    }]
  };
}

function registerHtmlAndPugLoader() {
  return {
    test: /\.pug$/,
    use: [
      { loader: 'html-loader', options: { attrs: false } },
      { loader: 'pug-html-loader', options: { pretty: true } }
    ]
  };
}

function walkSync(dir, filelist) {

  if( dir[dir.length-1] != '/') dir=dir.concat('/');

  var files = fs.readdirSync(dir);
  filelist = filelist || [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else 
    {
      filelist.push(path.join(dir,file));
    }
  });
  return filelist;
};

function buildHtmlPlugins (templateDir, dest) {
  // Read files in template directory
  const templateFiles = walkSync(path.resolve(__dirname, templateDir), [])
    .map(filedir => filedir.replace(path.resolve(__dirname, templateDir), ""));

  return templateFiles.map(item => {

    // Split names and extension
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: path.join(dest, `${name}.html`),
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

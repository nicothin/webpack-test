const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlPlugins = generateHtmlPlugins('./src/pages')

let conf = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].js'
  },
  devServer: {
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: "resolve-url-loader", options: { attempts: 1, debug: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ],
          // publicPath: '/dist',
        })
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts',
            publicPath: '../fonts',
          }
        }
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img',
            publicPath: '../img',
          }
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new ExtractTextPlugin(
      {filename: 'css/style.[chunkhash].css', disable: false, allChunks: true}
    ),
  ].concat(htmlPlugins),
};

module.exports = (env, options) => {
  let production = options.mode === 'production';

  conf.devtool = production ? false : 'sourcemap';

  return conf;
}

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}
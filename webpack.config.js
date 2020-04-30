const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    chrome: 52
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|otf|ttf)$/,
        use: ['file-loader?name=/assets/[name].[ext]']
      },
      {
        test: /\.svg$/,
        use: ['babel-loader', 'vue-svg-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ],
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  watchOptions: {
    ignored: ['dist', 'node_modules']
  },
  devServer: {
    https: true,
    writeToDisk: true,
    contentBase: path.resolve(__dirname)
  }
}

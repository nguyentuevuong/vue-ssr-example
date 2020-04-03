var path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const VueCSRPlugins = require('vue-server-renderer/client-plugin');
const VueSSRPlugins = require('vue-server-renderer/server-plugin');

const NODE_ENV = process.env.NODE_ENV;
const BUILD_MODE = process.env.BUILD_MODE;
const dependencies = require('./package.json').dependencies;

module.exports = {
  target: BUILD_MODE === 'server' ? 'node' : undefined,
  entry: `./src/main.${BUILD_MODE}.js`,
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  devtool: NODE_ENV === 'production' ? undefined : 'eval-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js',
    publicPath: '/',
    libraryTarget: BUILD_MODE === 'server' ? 'commonjs2' : undefined
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  performance: {
    hints: false
  },
  // Avoids bundling external dependencies, so node can load them directly from node_modules/
  externals: BUILD_MODE === 'server' ? Object.keys(dependencies) : undefined,
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    BUILD_MODE === 'server' ? new VueSSRPlugins() : new VueCSRPlugins(),
  ]
}
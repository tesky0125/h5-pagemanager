/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';

const argv = yargs.usage('Usage: npm start [options]')
  .example('npm start -- --port=3000 --cache --verbose', 'html5-pagemanager demo build')
  .alias('p', 'port')
  .default('p', 3000)
  .alias('c', 'cache')
  .default('c', false)
  .alias('v', 'verbose')
  .default('v', false)
  .help('h')
  .argv;

const PORT = global.PORT = argv.port;
const CACHE = global.CACHE = argv.cache;
const VERBOSE = global.VERBOSE = argv.verbose;
const DEBUG = global.DEBUG = true;

console.log('PORT:', PORT, ',CACHE:', CACHE, ',VERBOSE:', VERBOSE);

export default {
  entry: {
    'libs/demo': ['webpack-hot-middleware/client', 'webpack/hot/dev-server', path.resolve(__dirname, '../demo') + path.sep + 'index.js'],
  },
  output: {
    path: path.join(__dirname, '../demo/'),
    filename: '[name].js',
    publicPath: '/',
    sourcePrefix: '',
    sourceMapFilename: '[name].js.map',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../demo'),
      ],
      loaders: ['react-hot', 'babel-loader'],
    }],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      __DEV__: DEBUG,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  externals: [{
    react: 'React',
  }, {
    'react-dom': 'ReactDOM',
  }, {
    'h5_cache': 'h5_cache',
  }],
  stats: {
    colors: VERBOSE,
    reasons: VERBOSE,
    hash: VERBOSE,
    version: VERBOSE,
    timings: VERBOSE,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: CACHE,
    cachedAssets: CACHE,
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  devtool: 'cheap-module-eval-source-map',
  debug: DEBUG,
  cache: CACHE,
};
const CopyPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');
const { EnvironmentPlugin } = require('webpack');
const merge = require('webpack-merge');
const swConfig = require('./sw');
const {
  commonPlugins,
  shouldUseDevelopmentMode,
  getBrowserslistTargets,
} = require('./utils');

const tsconfigClient = resolve(__dirname, '../../tsconfig.json');

/**
 * The production webpack configuration for the 1FE shell is also treated as the "common" configuration.
 *
 * @param configOverrides
 */
const getProdConfig = async (configOverrides) => {
  // Get dynamic browserslist target
  const browserslistConfig = await getBrowserslistTargets();

  // Webpack read's browser list from the environment variable BROWSERSLIST
  process.env.BROWSERSLIST = browserslistConfig.join();

  const prodConfig = {
    mode: shouldUseDevelopmentMode ? 'development' : 'production',
    target: 'browserslist',
    devtool: shouldUseDevelopmentMode ? 'source-map' : false,
    entry: {
      bundle: ['core-js', './src/shell/main.tsx'],
    },
    output: {
      path: resolve(__dirname, '../../dist/public'),
      filename: 'js/[name].js',
      chunkFilename: 'js/chunk.[name].js',
      publicPath: 'auto',
      libraryTarget: 'system',
      library: {
        type: 'system',
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    optimization: {
      chunkIds: 'named',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-router': 'ReactRouter',
      'react-router-dom': 'ReactRouterDOM',
      '@remix-run/router': 'RemixRouter',
    },
    plugins: [
      ...commonPlugins,
      new EnvironmentPlugin({
        NODE_ENV: 'development',
        SYSTEM_ENVIRONMENT: true,
        IS_TEST_RUN: '0',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, '../../src/public'),
            to: resolve(__dirname, '../../dist/public'),
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: tsconfigClient,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.[cm]?js$/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
  };

  return [
    merge.mergeWithCustomize({ plugins: 'replace' })(
      prodConfig,
      configOverrides,
    ),
    swConfig,
  ];
};

module.exports = getProdConfig;

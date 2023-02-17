// SPDX-FileCopyrightText: Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

/* eslint-disable prefer-const, brace-style, no-unused-vars */

'use strict';

import {
  resolve as pathResolve,
  join as pathJoin,
  dirname as pathDirname,
} from 'path';
import {
  fileURLToPath as urlFileURLToPath,
} from 'url';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin'; // eslint-disable-line import/default
import {VueLoaderPlugin} from 'vue-loader';

// ----------------

const cjsDirname = pathDirname(urlFileURLToPath(import.meta.url));

// ----------------
// Env and tier
const tierIsProduction = process.env.NODE_ENV === 'production';
const tierIsStaging = process.env.NODE_ENV === 'staging';
const tierIsTesting = process.env.NODE_ENV === 'testing';
const tierIsDevelopment = process.env.NODE_ENV === 'development' || !(tierIsProduction || tierIsStaging || tierIsTesting);

let tierName;
if (tierIsProduction) {
  tierName = 'production';
} else if (tierIsStaging) {
  tierName = 'staging';
} else if (tierIsTesting) {
  tierName = 'testing';
} else {
  tierName = 'development';
}
// ----------------
// Source map type
const sourceMapType = (tierIsDevelopment) ? 'inline-source-map' : false;

// ----------------
// BASE CONFIG
const config = {
  mode: tierIsDevelopment ? 'development' : 'production',
  devtool: sourceMapType,
  context: cjsDirname,
  target: 'web',
  infrastructureLogging: {
    level: 'info',
  },
  stats: 'normal',
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
  entry: {
    files_3dmodelviewer: [
      pathResolve(cjsDirname, 'src/js/main.mjs'),
    ],
  },
  output: {
    path: pathResolve(cjsDirname, './js'),
    publicPath: '/js/',
    // skip contenthash, Nextcloud does cache busting via query
    // filename: (tierIsDevelopment) ? '[name].js' : '[name].[contenthash].js',
    // chunkFilename: (tierIsDevelopment) ? '[id].js' : '[id].[contenthash].js'
    filename: '[name].js',
  },
  resolve: {
    modules: [
      pathResolve(cjsDirname, 'src/js/'),
      'node_modules',
    ],
    extensions: ['.js', '.mjs', '.cjs', '.jsx', '.json', '.css', '.vue'],
    symlinks: false,
    alias: {
      js: pathResolve(cjsDirname, 'src/js/'),
    },
  },
};

// ----------------
// MODULE RULES
config.module = {
  rules: [
    {
      test: /\.(js|mjs|cjs|ts)x?$/,
      exclude: [/node_modules/, /bower_components/],
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      ],
    },
    // {
    //   test: /\.css$/,
    //   use: ['vue-style-loader', 'css-loader'],
    // },
    {
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
            // Align with Nextcloud Vue 2 approach
            modules: {
              auto: true,
              mode: (resourcePath) => {
                if (/pure.scss$/i.test(resourcePath)) { return 'pure'; }
                if (/global.scss$/i.test(resourcePath)) { return 'global'; }
                return 'local';
              },
              exportGlobals: false,
              localIdentName: (tierIsDevelopment) ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:22]',
              // localIdentContext
              // localIdentHashPrefix
              namedExport: false,
              exportLocalsConvention: 'asIs',
              exportOnlyLocals: false,
            },
            // modules: true,
            // modules: {
            //   mode: 'local',
            //   localIdentName: (tierIsDevelopment) ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:22]',
            // },
          },
        },
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     sourceMap: true,
        //     postcssOptions: {
        //       minimize: false,
        //       config: pathResolve(cjsDirname, '.postcssrc.cjs'),
        //     },
        //   },
        // },
        {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            additionalData: `$env: ${tierName};`,
          },
        },
      ],
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      options: {
        name: '[name].[ext]?[hash]',
        limit: 8192,
      },
    },
  ],
};

// ----------------
// OPTIMISATION
config.optimization = {
  minimize: !(tierIsDevelopment || tierIsTesting), // can override
  minimizer: [
    new TerserPlugin({
      test: /\.m?js(\?.*)?$/i,
      parallel: true,
      extractComments: false,
      terserOptions: {
        parse: {},
        compress: {
          drop_console: !(tierIsDevelopment || tierIsTesting),
        },
        mangle: false,
        module: false,
        format: {
          comments: false,
        },
        sourceMap: false,
        toplevel: false,
        nameCache: null,
        ie8: false,
        // keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    }),
  ],
  // Skip chunking settings for Nextcloud
};

// ----------------
// PLUGINS
config.plugins = [];

// ----------------
// DefinePlugin
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': (tierIsDevelopment) ? JSON.stringify('development') : JSON.stringify('production'),
  'process.env.BROWSER': true,
  __TIER_DEVELOPMENT__: tierIsDevelopment,
  __TIER_TESTING__: tierIsTesting,
  __TIER_STAGING__: tierIsStaging,
  __TIER_PRODUCTION__: tierIsProduction,
  __CLIENT__: true,
  __SERVER__: false,
  __DEVTOOLS__: tierIsDevelopment,
  __DEV__: tierIsDevelopment,
  __PROD__: !tierIsDevelopment,
  __WARP_DEBUG__: tierIsDevelopment || tierIsTesting, // for debug to work
}));

// ----------------
// VueLoaderPlugin
config.plugins.push(new VueLoaderPlugin());

// ----------------
// ESLintPlugin
config.plugins.push(new ESLintPlugin({
  extensions: ['js', 'mjs', 'cjs', 'ts', 'jsx', 'mjsx', 'cjsx', 'tsx'],
  // files: /\.(js|mjs|cjs|ts)x?$/,
  exclude: ['node_modules'],
  emitError: true,
  emitWarning: true,
  failOnError: !tierIsDevelopment,
  failOnWarning: false,
  quiet: false,
  outputReport: false,
}));

// ----------------
// StyleLint
config.plugins.push(new StylelintPlugin({
  configFile: pathResolve(cjsDirname, '.stylelintrc.cjs'),
  files: ['**/*.(s(c|a)ss|css)'],
  fix: false,
  lintDirtyModulesOnly: false,
  emitError: !tierIsDevelopment,
  emitWarning: true,
  failOnError: false,
  failOnWarning: false,
  quiet: false,
}));

// ----------------
// CopyPlugin
config.plugins.push(new CopyPlugin({
  patterns: [
    {
      from: pathResolve(cjsDirname, 'node_modules/online-3d-viewer/libs'),
      to: pathResolve(cjsDirname, 'js/libs/'),
      toType: 'dir',
      force: true,
    },
    {
      from: pathResolve(cjsDirname, 'src/img/envmaps/dist'),
      to: pathResolve(cjsDirname, 'img/envmaps/'),
      toType: 'dir',
      force: true,
    },
    {
      from: pathResolve(cjsDirname, 'src/img/icons-mime/dist'),
      to: pathResolve(cjsDirname, 'img/icons-mime/'),
      toType: 'dir',
      force: true,
    },
    {
      from: pathResolve(cjsDirname, 'src/img/icons-app/dist'),
      to: pathResolve(cjsDirname, 'img/'),
      toType: 'dir',
      force: true,
    },
  ],
  options: {
    concurrency: 100,
  },
}));

// Nextcloud keep CSS in JS for now
// // ----------------
// // MiniCssExtractPlugin
// if (miniCssExtractEnabled) {
//   config.plugins.push(new MiniCssExtractPlugin({
//     filename: (tierIsDevelopment) ? '[name].css' : '[name].[contenthash].css',
//     chunkFilename: (tierIsDevelopment) ? '[id].css' : '[id].[contenthash].css'
//   }));
// }

// ----------------
// POSTCSS LOADER CONFIG
// defined in .postcssrc.cjs

// ----------------
// BROWSERSLIST CONFIG
// defined in .browserslistrc

// ----------------
// BABEL CONFIG
// defined in .babelrc.cjs

// ----------------
// ESLINT CONFIG
// defined in .eslintrc.cjs and .eslintignore

// ----------------
// STYLELINT CONFIG
// defined in .stylelintrc.cjs and .stylelintignore

export default config;

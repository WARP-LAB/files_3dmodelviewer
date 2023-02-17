// SPDX-FileCopyrightText: Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

// keep json compatible key naming (double quotes) and comma trailing
/* eslint-disable quotes, quote-props */

// Babel supports ESM configuration, but babel-loader still chokes

// Align with Nextcloud
// https://github.com/nextcloud/babel-config
// const babelConfig = require('@nextcloud/babel-config')
// module.exports = babelConfig

// do not include, but unroll manually and extend
// https://github.com/nextcloud/babel-config/blob/master/index.js

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        // "useBuiltIns": false,
        // "modules": "auto",
        "modules": false,
        "useBuiltIns": "usage",
        "corejs": '3.28',
        "forceAllTransforms": false,
        "ignoreBrowserslistConfig": false,
        "debug": false,
      },
    ],
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
  ],
};

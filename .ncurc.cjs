// SPDX-FileCopyrightText: Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

// keep json compatible key naming (double quotes) and comma trailing
/* eslint-disable quotes, quote-props */

module.exports = {
  "reject": [
    // hold for mainline Nextcloud (currently at Vue 2)
    "vue",
    "vue-eslint-parser",
    "vue-loader",
    "vue-style-loader",
    "vue-template-compiler",
    // hold for stylelint-webpack-plugin
    "stylelint",
  ],
};

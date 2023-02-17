// SPDX-FileCopyrightText: Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

// keep json compatible key naming (double quotes) and comma trailing
/* eslint-disable quotes, quote-props */

// Align with Nextcloud
// https://github.com/nextcloud/stylelint-config
// const stylelintConfig = require('@nextcloud/stylelint-config'); // eslint-disable-line
// module.exports = stylelintConfig;

// do not include, but unroll manually and extend
// https://github.com/nextcloud/stylelint-config/blob/master/index.js

module.exports = {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
  ],
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.svg'],
  rules: {
    // indentation: 'tab',
    'selector-type-no-unknown': null,
    'number-leading-zero': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'inside-block'],
      },
    ],
    'declaration-empty-line-before': [
      'never',
      {
        ignore: ['after-declaration'],
      },
    ],
    'comment-empty-line-before': null,
    'selector-type-case': null,
    'selector-list-comma-newline-after': null,
    'no-descending-specificity': null,
    'string-quotes': 'single',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['deep'],
      },
    ],
    // ------------------------------------
    // override Nextcloud tabbing stuff
    indentation: 2,
  },
};

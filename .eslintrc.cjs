// SPDX-FileCopyrightText: Nextcloud contributors
// SPDX-License-Identifier: AGPL-3.0-or-later

// keep json compatible key naming (double quotes) and comma trailing
/* eslint-disable quotes, quote-props */

// NC Coding style & general guidelines
// https://docs.nextcloud.com/server/latest/developer_manual/getting_started/codingguidelines.html
// naaah, no tabs

module.exports = {
  "root": true,
  "extends": [
    "@nextcloud/eslint-config",
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    requireConfigFile: false,
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "globalReturn": true,
      "impliedStrict": true,
      "jsx": false,
    },
  },
  "env": {
    "es2020": true,
    "node": false,
    "browser": true,
    "worker": false,
    "serviceworker": false,
  },

  "rules": {
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)

    // Semicolons
    "semi": [2, "always"], // https://eslint.org/docs/rules/semi
    "no-extra-semi": 2, // https://eslint.org/docs/rules/no-extra-semi
    "semi-spacing": [2, {"before": false, "after": true}], // https://eslint.org/docs/rules/semi-spacing

    // Spacing
    // curly spacing, keep "consistent" with array-bracket-spacing
    "object-curly-spacing": [1, "never"], // https://eslint.org/docs/rules/object-curly-spacing
    "generator-star-spacing": [1, {"before": true, "after": false}], // https://eslint.org/docs/rules/generator-star-spacing

    // Others
    "brace-style": [1, "stroustrup"], // https://eslint.org/docs/rules/brace-style
    "object-shorthand": [1, "always"], // https://eslint.org/docs/rules/object-shorthand
    "arrow-parens": [1, "always"], // https://eslint.org/docs/rules/arrow-parens
    "no-unused-expressions": 0, // https://eslint.org/docs/rules/no-unused-expressions hande this in Babel level because of do expressions

    // JSX
    "jsx-quotes": [2, "prefer-double"], // https://eslint.org/docs/rules/jsx-quotes

    // eslint-plugin-import, https://github.com/benmosher/eslint-plugin-import
    // Ensure consistent use of file extension within the import path
    "import/extensions": [0, {"js": "always", "json": "always"}], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md

    // FIXME: align with Nextcloud
    // // babel-eslint-plugin, https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin#rules
    // "@babel/new-cap": 1,
    // "@babel/object-curly-spacing": 1,
    // "@babel/no-unused-expressions": 2,

    // ------------------------------------
    // override Nextcloud tabbing stuff
    "indent": ["error", 2],
    "vue/html-indent": ["error", 2],
    "vue/first-attribute-linebreak": ["error", {
      "singleline": "ignore",
      "multiline": "below",
    }],
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "always",
    }],
    "no-console": 0, // we strip console on prod anyways
    // bring in Nextcloud stuff
    "comma-dangle": ["warn", "always-multiline"],
    "jsdoc/require-jsdoc": 0,
    "space-before-function-paren": ["error", "always"],
  },
};

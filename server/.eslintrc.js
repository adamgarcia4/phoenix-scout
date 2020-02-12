module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parser: '@typescript-eslint/parser',
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    settings: {
        "import/resolver": {
          "node": {
            "extensions": ['.js', '.jsx', '.ts', '.tsx']
          }
        }
      },
      plugins: [
          '@typescript-eslint'
      ],
    "rules": {
      "semi": [1, 'never'],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"
        }
     ],
     "@typescript-eslint/no-unused-vars": [2],
     "indent": ["error", "tab"],
     'no-tabs': ["error", { allowIndentationTabs: true }],
     'arrow-body-style': [0],
     'react/jsx-indent-props': [0],
     'no-restricted-syntax': [0],
    //  'react/jsx-first-prop-new-line': 'multiline'
      camelcase: [0],
      'no-console': [0],
      'import/no-unresolved': [2, { ignore: ['@shared\/.'] }],
      'no-case-declarations': 0,
      'no-underscore-dangle': [0]
    },
};
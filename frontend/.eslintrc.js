module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    "react/jsx-filename-extension": [0],
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
   "react/jsx-indent": ["error", 'tab'],
   'arrow-body-style': [0],
   'react/jsx-indent-props': [0],
   'no-restricted-syntax': [0],
  //  'react/jsx-first-prop-new-line': 'multiline'
    camelcase: [0],
    'no-console': [0],
  },
};

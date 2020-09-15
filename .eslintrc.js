module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      legacyDecorators: true,
    },
  },
  env: {
    node: true,
    'jest/globals': true,
    es6: true,
  },
  globals: {
    fetch: true,
    Promise: true,
    __DEV__: true,
    window: true,
    FormData: true,
    ErrorUtils: true,
  },
  rules: {
    'no-console': 'error',
    curly: 'error',
    'require-await': 'error',
    'no-unneeded-ternary': 'error',
    'max-params': 'error',
    'max-lines': [
      'error',
      {
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'no-return-await': 'error',
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'no-empty': ['error', { allowEmptyCatch: true }],

    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unused-modules': ['error', { unusedExports: true }],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#eslint-plugin-import
    // We recommend you do not use the following import rules, as TypeScript provides the same checks as part of standard type checking:
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',

    'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
    'react/no-array-index-key': 'error',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',

    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    'jest/no-identical-title': 'off',
    'jest/no-standalone-expect': 'off',
    'jest/no-test-prefixes': 'off',
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'expect',
          'snapshot',
          'renderWithContext.snapshot',
          '*.snapshot',
          'diffSnapshot',
          'renderWithContext.diffSnapshot',
          '*.diffSnapshot',
          'renderScreen.snapshot',
          'testSnapshot',
          'testSnapshotShallow',
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      // config for eslint-import-resolver-typescript package
      typescript: {
        alwaysTryTypes: true,
        directory: './tsconfig.json',
      },
    },
    'import/external-module-folders': ['node_modules', '@types'],
    react: {
      version: 'detect',
    },
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'import', 'react-hooks'],
  overrides: [
    {
      files: ['**/__tests__/**/*.js'],
      rules: {
        'max-lines-per-function': 'off',
      },
    },
  ],
};

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import pluginN from 'eslint-plugin-n'

export default [
  js.configs.recommended,
  pluginN.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      n: { version: '>=24.0.0' },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'n/file-extension-in-import': ['error', 'always'],
    },
  },
  {
    ignores: [
      'dist',
      'build',
      'coverage',
      'node_modules',
      'src/dev-data',
      'eslint.config.js',
    ],
  },
]

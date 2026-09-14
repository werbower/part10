// https://docs.expo.dev/guides/using-eslint/
 const { defineConfig } = require('eslint/config')
 const expoConfig = require("eslint-config-expo/flat")
 const js = require("@eslint/js")
 const tseslint = require("typescript-eslint")
 const stylistic = require("@stylistic/eslint-plugin")
 
module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {'@stylistic': stylistic},
    ignores: ["dist/*"],
    extends: [js.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/indent': ['error', 2]
    }
  }
])

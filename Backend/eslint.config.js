import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'frontendBuild/**'],
  },
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        node: true,
      },
    },
    rules: {
      // you can start empty, or add basic rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_',varsIgnorePattern:'^_' }],
      // '@typescript-eslint/no-explicit-any': 'off',
      'no-fallthrough': 'error',
      'no-prototype-builtins': 'error',
    },
  },
]);

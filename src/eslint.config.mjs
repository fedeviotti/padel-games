import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier formatter come regola ESLint
      'prettier/prettier': 'error',
      // Opzionale: limite di lunghezza della riga
      'max-len': ['error', { code: 100 }],
      'sort-imports': 'off', // disabilita ordinamento nativo ESLint
      'import/order': 'off', // disabilita ordinamento da eslint-plugin-import
      'import/first': 'off', // disabilita controllo su posizione import
      'import/newline-after-import': 'off', // disabilita newline forzato
    },
  },
];

export default eslintConfig;

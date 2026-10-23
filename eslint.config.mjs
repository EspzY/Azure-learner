import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  // R3F's documented useFrame model mutates Three objects, not React state.
  { files: ['src/features/rpg/scene.tsx'], rules: { 'react-hooks/immutability': 'off' } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
]);

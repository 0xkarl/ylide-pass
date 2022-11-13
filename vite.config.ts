import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fullReload from 'vite-plugin-full-reload';

import { compilerOptions } from './tsconfig.json';

const hmr = process.env.VITE_HMR === 'true';
const paths: Record<string, string[]> = compilerOptions['paths'];
const alias = Object.entries(paths).reduce((acc, [key, [value]]) => {
  const aliasKey = key.substring(0, key.length - 2);
  const path = value.substring(0, value.length - 2);
  return {
    ...acc,
    [aliasKey]: resolve(__dirname, path),
  };
}, {});

export default defineConfig({
  resolve: {
    alias: {
      ...alias,
    },
  },
  plugins: [
    react(),
    ...(hmr ? [] : [fullReload(['src/**/*', 'public/**/*', 'index.html'])]),
  ],
  define: {
    'process.env.NODE_DEBUG': 'false',
  },
  build: {
    target: ['esnext'],
  },
  server: {
    host: '0.0.0.0',
    hmr,
  },
});

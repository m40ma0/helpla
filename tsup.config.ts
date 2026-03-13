import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['api/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  clean: true,
  bundle: true,
  splitting: false,
})
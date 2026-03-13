import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'api',
  bundle: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  clean: true,
  outExtension() {
    return {
      js: '.js',
    }
  },
})
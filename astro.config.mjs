import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nabil.fm',
  output: 'static',
  build: {
    assets: '_assets'
  }
});

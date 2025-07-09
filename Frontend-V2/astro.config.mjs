// @ts-check
import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';
import react from '@astrojs/react';

dotenv.config();
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: { 
    host: '0.0.0.0',
    port: Number(process.env.PORT)
  },
  vite: {
    define: {
      'import.meta.env.VITE_SERVER': JSON.stringify(process.env.VITE_SERVER)
    }
  },
  outDir: (process.env.OUTDIR || "./build")
});
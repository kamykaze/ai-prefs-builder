import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the GitHub Pages repo path so built asset URLs resolve.
// Served at https://<user>.github.io/ai-prefs-builder/
export default defineConfig({
  plugins: [react()],
  base: '/ai-prefs-builder/',
})

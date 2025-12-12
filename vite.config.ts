import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely inject the API key. 
    // We map process.env to an object containing only what we need to prevent leaking other secrets.
    'process.env': {
      API_KEY: process.env.API_KEY
    }
  }
})
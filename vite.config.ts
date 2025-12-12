import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely inject the API key as a string literal. 
    // JSON.stringify ensures the value is wrapped in quotes in the final bundle.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
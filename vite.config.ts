import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin to generate firebase-config.js and inject config into HTML
const firebaseConfigPlugin = {
  name: 'firebase-config',
  transformIndexHtml: {
    order: 'pre' as const,
    handler(html: string) {
      // Load environment variables
      const env = loadEnv('development', process.cwd())
      
      const firebaseConfig = {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
      }

      // Log the configuration to debug
      // console.log('Firebase Config:', firebaseConfig)

      // Generate firebase-config.js file
      const configScript = `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)}`
      fs.writeFileSync(path.resolve(__dirname, 'public/firebase-config.js'), configScript)

      // Inject config into HTML
      return html.replace(
        '</head>',
        `<script>${configScript}</script></head>`
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), firebaseConfigPlugin],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-store'
    }
  },
  build: {
    // chunkSizeWarningLimit: 1000, // Increase the warning limit to 1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'react-hook-form',
            'react-markdown',
            'react-redux',
            'react-window',
            '@reduxjs/toolkit'
          ],
          'ui': [
            'flowbite',
            'flowbite-react',
            '@clerk/clerk-react',
          ],
          'logging': [
            '@grafana/faro-react',
            '@grafana/faro-web-sdk',
          ]
        }
      }
    }
  }
})

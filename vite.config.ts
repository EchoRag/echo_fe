import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { faroSourceMapPlugin } from '@grafana/faro-rollup-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

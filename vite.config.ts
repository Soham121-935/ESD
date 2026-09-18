import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Preview/dev server is reached through a public proxy (https://<port>-<sandbox>.e2b.app),
// so the host and any host header must be accepted.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
})

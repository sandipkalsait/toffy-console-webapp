import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0',
    port: 8080,
    hmr: {
      clientPort: 8080, // Set the port for HMR
      protocol: 'ws', // Ensure you're using WebSocket for HMR
    },
  },
})

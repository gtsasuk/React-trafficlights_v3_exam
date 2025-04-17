import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/trafficLights": {
        target: "https://traffic-lights-api.onrender.com:10000",
        changeOrigin: true,
        secure: false
      },
      "/settings": {
        target: "https://traffic-lights-api.onrender.com:10000",
        changeOrigin: true,
        secure: false
      }
    }
  }
})

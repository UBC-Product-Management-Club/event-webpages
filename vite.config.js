import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base is "/" for a (sub)domain deploy such as productjackpot.ubcpmc.com.
// When hosted under a subpath (e.g. ubc-product-management-club.github.io/event-webpages),
// build with:  VITE_BASE=/event-webpages/ npm run build  (the deploy workflow does this)
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})

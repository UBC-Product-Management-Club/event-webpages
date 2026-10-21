import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base is "/" for a (sub)domain deploy such as productjackpot.ubcpmc.com.
// If you ever host under a subpath (e.g. username.github.io/product-jackpot),
// build with:  VITE_BASE=/product-jackpot/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})

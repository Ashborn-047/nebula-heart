import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // Base path for GitHub Pages deployment (use repo name)
    base: process.env.GITHUB_ACTIONS ? '/nebula-heart/' : '/',
    plugins: [
        react(),
        tailwindcss()
    ]
})

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'pages/index.html'),
                model: resolve(__dirname, 'pages/model.html'),
            },
        },
    },
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite' // Добавили loadEnv
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Загружаем переменные из .env на основе текущего режима (development/production)
  // process.cwd() указывает на корень проекта, где лежит .env
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
    ],
    define: {
      // Это принудительно заменяет process.env во всем коде фронтенда
      // на значения, которые Vite нашел в .env
      'process.env': env,
      // Если хочешь использовать import.meta.env (рекомендуется),
      // Vite сделает это сам, если в .env есть префикс VITE_
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        events: 'events',
      },
    },
  }
})
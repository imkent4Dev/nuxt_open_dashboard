// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  // CSS
  css: [
    '~/assets/css/main.css',
    '~/assets/css/styles.css'
  ],
  
  // Tailwind CSS configuration
  tailwindcss: {
    configPath: 'tailwind.config.js'
  },
  
  // App configuration
  app: {
    head: {
      title: 'Dashboard - Nuxt 3',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern dashboard built with Nuxt 3' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      appName: 'Dashboard App',
      apiBase: 'http://localhost:8081'
    }
  },

  // Vite config for development proxy (MAIN FIX FOR CORS)
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    }
  }
})
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'  // Fixed: was '@piania/nuxt'
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
      title: 'Dashboard - Nuxt 3',  // Fixed: removed "Welcome" and corrected version
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },  // Fixed: was 'width-device-width, inial-scale=1'
        { name: 'description', content: 'Modern dashboard built with Nuxt 3' }  // Fixed: was 'decription' and 'build'
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      appName: 'Dashboard App'
    }
  }
})
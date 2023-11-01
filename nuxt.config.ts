// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'acceptHMRUpdate'],
    },
    ],
    '@vite-pwa/nuxt'
  ],
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  pwa: {
    manifest: {
      name: 'OROD',
      short_name: 'OROD',
      lang: 'fr',
      display: 'standalone',
      background_color: '#020617',
      theme_color: '#020617',
      icons: [
        {
          src: '/public/assets/shop-logo.svg',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
  },
  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  // },
  runtimeConfig: {
    // 只在服务端可以访问的配置项
    mongoUrl: process.env.NUXT_MONGO_URL || '',
    // 可以暴露给客户端使用的配置项
    public: {
      apiBase: '/api'
    }
  },
  imports: {
    dirs: ['store']
  },
})

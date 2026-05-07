export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-auth-utils'
  ],
  // Kita matikan nuxthub database sementara agar tidak bentrok
  nitro: {
    externals: {
      external: ['better-sqlite3']
    }
  }
})
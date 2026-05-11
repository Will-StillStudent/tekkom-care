export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-auth-utils'
  ],
  // Matikan hub blob karena kita sudah pakai cara manual fs
  hub: {
    database: true 
  },
  nitro: {
    externals: {
      external: ['better-sqlite3']
    }
  }
})
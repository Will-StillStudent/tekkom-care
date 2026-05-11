// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  // 1. Jika belum login dan bukan di halaman login/register, lempar ke login
  if (loggedIn.value === false && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // 2. Jika sudah login tapi malah buka halaman login/register, lempar ke beranda
  if (loggedIn.value === true && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
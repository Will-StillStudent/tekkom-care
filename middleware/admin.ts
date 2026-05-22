interface AuthUser {
  id: number
  nama: string
  nim: string
  email: string
  role: 'user' | 'admin'
}

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useUserSession()

  // Jika user tidak login atau bukan admin, lempar error 403
  if (!user.value || (user.value as AuthUser).role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Admin access required'
    })
  }
})

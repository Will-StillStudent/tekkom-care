import { users } from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  
  const result = await db.select().from(users).where(
    and(
      eq(users.email, body.email),
      eq(users.password, body.password)
    )
  ).limit(1)

  const user = result[0]
  if (!user) throw createError({ statusCode: 401, message: 'Email/Password salah' })

  await setUserSession(event, {
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role // Pastikan kolom role tersimpan di session
    }
  })

  // Tambahkan 'role' di return agar bisa dibaca oleh halaman login.vue
  return { success: true, role: user.role }
})
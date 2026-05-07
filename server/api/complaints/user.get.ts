// server/api/complaints/user.get.ts
import { complaints } from '~/server/database/schema'
import { eq, desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // 1. Ambil session user
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Harus login' })

  // 2. Ambil data dari database manual (db)
  // Kita urutkan dari yang paling baru (desc)
  return await db.select()
    .from(complaints)
    .where(eq(complaints.userId, user.id))
    .orderBy(desc(complaints.createdAt))
})
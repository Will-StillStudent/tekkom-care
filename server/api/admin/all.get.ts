// server/api/admin/all.get.ts
import { complaints } from '~/server/database/schema'
import { desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // Proteksi: Hanya admin yang boleh panggil API ini
  const { user } = await getUserSession(event)
  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Terlarang bagi non-admin' })
  }

  // Ambil semua aduan dari database
  return await db.select().from(complaints).orderBy(desc(complaints.createdAt))
})
// server/api/complaints/[id].get.ts
import { complaints } from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Harus login' })

  // Ambil ID dari URL (/api/complaints/5)
  const id = getRouterParam(event, 'id')

  // Ambil data aduan yang ID-nya cocok DAN milik user yang sedang login (keamanan)
  const result = await db.select().from(complaints).where(
    and(
      eq(complaints.id, Number(id)),
      eq(complaints.userId, user.id)
    )
  ).limit(1)

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Aduan tidak ditemukan' })
  }

  return result[0]
})
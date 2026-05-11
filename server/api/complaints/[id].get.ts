// server/api/complaints/[id].get.ts
import { complaints } from '~/server/database/schema'
import { eq, and, or } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Harus login' })

  const id = getRouterParam(event, 'id')

  // LOGIKA IZIN: 
  // Ambil data jika (ID cocok) DAN (milik user ini ATAU yang akses adalah admin)
  const result = await db.select().from(complaints).where(
    eq(complaints.id, Number(id))
  ).limit(1)

  const item = result[0]

  if (!item) {
    throw createError({ statusCode: 404, message: 'Aduan tidak ditemukan' })
  }

  // KEAMANAN: Jika bukan admin DAN bukan miliknya sendiri, maka blokir
  if (user.role !== 'admin' && item.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Anda tidak berhak melihat aduan ini' })
  }

  return item
})
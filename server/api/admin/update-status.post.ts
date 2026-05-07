import { complaints } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  
  // Pastikan menggunakan koneksi database manual kita (db)
  await db.update(complaints)
    .set({ status: body.status })
    .where(eq(complaints.id, Number(body.id)))

  return { success: true }
})
// server/api/user/stats.get.ts
import { complaints } from '~/server/database/schema'
import { eq, count } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) return { total: 0, pending: 0, proses: 0, selesai: 0 }

  // Gunakan 'db' manual yang kita buat di server/utils/db.ts
  const data = await db.select({
    status: complaints.status,
    jumlah: count()
  })
  .from(complaints)
  .where(eq(complaints.userId, user.id))
  .groupBy(complaints.status)

  // Format data untuk dashboard
  const stats = { total: 0, pending: 0, proses: 0, selesai: 0 }
  
  data.forEach(item => {
    stats.total += item.jumlah
    if (item.status === 'Pending') stats.pending = item.jumlah
    if (item.status === 'Diproses') stats.proses = item.jumlah
    if (item.status === 'Selesai') stats.selesai = item.jumlah
  })

  return stats
})
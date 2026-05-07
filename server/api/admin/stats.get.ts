// server/api/admin/stats.get.ts
import { complaints } from '~/server/database/schema'
import { count, eq, desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // 1. Proteksi Admin
  const { user } = await getUserSession(event)
  if (user?.role !== 'admin') throw createError({ statusCode: 403 })

  // 2. Hitung Statistik Utama
  const allData = await db.select().from(complaints)
  
  const stats = {
    total: allData.length,
    menunggu: allData.filter(c => c.status === 'Pending').length,
    diproses: allData.filter(c => c.status === 'Diproses').length,
    selesai: allData.filter(c => c.status === 'Selesai').length,
    ditolak: allData.filter(c => c.status === 'Ditolak').length,
  }

  // 3. Hitung per Kategori
  const categories = {
    fasilitas: allData.filter(c => c.kategori.includes('Fasilitas')).length,
    sdm: allData.filter(c => c.kategori.includes('SDM')).length,
    lingkungan: allData.filter(c => c.kategori.includes('Lingkungan')).length,
  }

  // 4. Ambil 3 Aduan Terbaru
  const recent = await db.select()
    .from(complaints)
    .orderBy(desc(complaints.createdAt))
    .limit(3)

  return { stats, categories, recent }
})
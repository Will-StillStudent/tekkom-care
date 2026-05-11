import { complaints, notifications } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // 1. Cek Keamanan: Pastikan yang melakukan update adalah Admin
  const session = await getUserSession(event)
  if (session.user?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Hanya Admin yang dapat mengubah status aduan'
    })
  }

  // 2. Ambil data dari body request (id, status, dan tanggapanAdmin)
  const body = await readBody(event)

  try {
    // 3. Update data aduan di tabel complaints
    // Kita gunakan db manual dari utils/db.ts
    await db.update(complaints)
      .set({ 
        status: body.status, 
        tanggapanAdmin: body.tanggapanAdmin 
      })
      .where(eq(complaints.id, Number(body.id)))

    // 4. Ambil data aduan tersebut untuk mengetahui siapa pemiliknya (userId)
    // Ini diperlukan agar kita bisa mengirim notifikasi ke orang yang tepat
    const aduanData = await db.select()
      .from(complaints)
      .where(eq(complaints.id, Number(body.id)))
      .limit(1)

    const aduan = aduanData[0]

    if (aduan) {
      // 5. Kirim Notifikasi ke User (Willy)
      await db.insert(notifications).values({
        userId: aduan.userId, // ID user pemilik aduan
        title: 'Update Status Aduan',
        message: `Aduan "${aduan.judul}" Anda telah diperbarui menjadi: ${body.status}`,
        link: `/aduan-saya/${aduan.id}`, // Link yang akan dibuka saat notif diklik
        isRead: 0,
        createdAt: new Date().toISOString()
      })
      
      console.log(`✅ Berhasil update aduan #${body.id} dan kirim notifikasi ke User #${aduan.userId}`)
    }

    return { success: true, message: 'Aduan berhasil diperbarui' }

  } catch (error: any) {
    console.error('❌ Update Aduan Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memperbarui database: ' + error.message
    })
  }
})
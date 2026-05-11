import { complaints, notifications, users } from '~/server/database/schema'
import fs from 'node:fs'
import path from 'node:path'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // 1. Cek Login
  const { user } = await getUserSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Silakan login' })

  // 2. Baca data dari form
  const formData = await readFormData(event)
  const judul = formData.get('judul') as string
  const kategori = formData.get('kategori') as string
  const lokasi = formData.get('lokasi') as string
  const deskripsi = formData.get('deskripsi') as string
  const fileGambar = formData.get('gambar') as File | null

  let namaFileTersimpan = null

  try {
    // 3. LOGIKA SIMPAN GAMBAR (Manual fs)
    if (fileGambar && fileGambar.size > 0) {
      namaFileTersimpan = `${Date.now()}-${fileGambar.name.replace(/\s+/g, '-')}`
      const folderTujuan = path.join(process.cwd(), 'public', 'uploads')
      
      if (!fs.existsSync(folderTujuan)) {
        fs.mkdirSync(folderTujuan, { recursive: true })
      }

      const pathLengkap = path.join(folderTujuan, namaFileTersimpan)
      const bytes = await fileGambar.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fs.writeFileSync(pathLengkap, buffer)
      
      console.log('✅ Gambar berhasil disimpan secara fisik')
    }

    // 4. SIMPAN ADUAN KE DATABASE
    // Kita gunakan .returning() agar bisa mendapatkan ID aduan yang baru saja dibuat
    const aduanBaru = await db.insert(complaints).values({
      judul,
      kategori,
      lokasi,
      deskripsi,
      userId: user.id,
      gambar: namaFileTersimpan,
      status: 'Pending',
      createdAt: new Date().toISOString()
    }).returning()

    const idTerbuat = aduanBaru[0].id

    // 5. KIRIM NOTIFIKASI KE ADMIN
    // Ambil daftar user yang memiliki role 'admin'
    // Pastikan nama variabel ini (listAdmin) unik
    const listAdmin = await db.select().from(users).where(eq(users.role, 'admin'))

    for (const admin of listAdmin) {
      await db.insert(notifications).values({
        userId: admin.id,
        title: 'Aduan Baru Masuk!',
        message: `${user.nama} mengirim aduan: ${judul}`,
        link: `/admin/aduan/${idTerbuat}`, // Link langsung ke detail aduan tersebut
        isRead: 0,
        createdAt: new Date().toISOString()
      })
    }

    console.log(`✅ Aduan #${idTerbuat} tersimpan & Notifikasi terkirim ke ${listAdmin.length} admin`)

    return { success: true }

  } catch (e: any) {
    console.error("CRITICAL ERROR:", e)
    throw createError({ 
      statusCode: 500, 
      message: "Gagal memproses aduan: " + e.message 
    })
  }
})
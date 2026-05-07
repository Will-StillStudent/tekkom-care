// server/api/complaints/create.post.ts
import { complaints } from '~/server/database/schema'

export default eventHandler(async (event) => {
  // 1. Ambil session user
  const { user } = await getUserSession(event)
  
  if (!user) {
    throw createError({ statusCode: 401, message: 'Silakan login kembali' })
  }

  // 2. Ambil data dari form
  const body = await readBody(event)

  try {
    // 3. Simpan ke database menggunakan 'db' manual dari utils
    await db.insert(complaints).values({
      judul: body.judul,
      kategori: body.kategori,
      lokasi: body.lokasi,
      deskripsi: body.deskripsi,
      userId: user.id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    })

    return { success: true }
  } catch (err: any) {
    console.error("SERVER ERROR:", err)
    throw createError({ 
      statusCode: 500, 
      message: 'Gagal simpan ke database' 
    })
  }
})
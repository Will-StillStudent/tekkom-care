import { users } from '~/server/database/schema'

export default eventHandler(async (event) => {
  const body = await readBody(event)

  try {
    console.log('Mencoba menyimpan ke database manual...')
    
    // Kita langsung pakai 'db' dari utils (auto-imported oleh Nuxt)
    const newUser = await db.insert(users).values({
      nama: body.nama,
      nim: body.nim,
      email: body.email,
      password: body.password,
    }).returning()

    const user = newUser[0]

    // Buat session login
    await setUserSession(event, {
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email
      }
    })

    return { success: true }
  } catch (e: any) {
    console.error("ERROR:", e)
    throw createError({ 
      statusCode: 400, 
      message: 'Gagal Simpan: ' + e.message 
    })
  }
})
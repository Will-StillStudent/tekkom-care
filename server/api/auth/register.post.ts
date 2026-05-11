import { users } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nama, nim, email, password } = body

  // --- VALIDASI EMAIL UNDIP ---
  if (!email.endsWith('@students.undip.ac.id')) {
    throw createError({ statusCode: 400, message: 'Wajib menggunakan email @students.undip.ac.id' })
  }

  // --- VALIDASI NIM (14 DIGIT ANGKA) ---
  const nimRegex = /^\d{14}$/
  if (!nimRegex.test(nim)) {
    throw createError({ statusCode: 400, message: 'NIM harus berupa 14 digit angka!' })
  }

  // --- VALIDASI PASSWORD KETAT ---
  // Minimal 8 karakter, ada 1 Huruf Besar, dan 1 Simbol ( . - _ )
  const hasMinLen = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasSymbol = /[.\-_]/.test(password)

  if (!hasMinLen || !hasUpper || !hasSymbol) {
    throw createError({ 
      statusCode: 400, 
      message: 'Sandi harus 8 karakter, memiliki huruf KAPITAL, dan simbol ( . atau - atau _ )' 
    })
  }

  try {
    // Simpan ke database (db manual dari server/utils/db.ts)
    const newUser = await db.insert(users).values({
      nama,
      nim,
      email,
      password,
      role: 'user'
    }).returning()

    // Login Otomatis
    await setUserSession(event, {
      user: { id: newUser[0].id, nama: newUser[0].nama, email: newUser[0].email, role: 'user' }
    })

    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 400, message: 'Email atau NIM sudah terdaftar' })
  }
})
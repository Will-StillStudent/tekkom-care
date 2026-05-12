import { users } from '~/server/database/schema'
import { hashPassword } from '~/server/utils/password'

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
    // Hash password before storing
    const hashedPassword = await hashPassword(password)

    // Simpan ke database (db manual dari server/utils/db.ts)
    const newUser = await db.insert(users).values({
      nama,
      nim,
      email,
      password: hashedPassword,
      role: 'user'
    }).returning()

    if (!newUser || newUser.length === 0) {
      throw createError({ statusCode: 500, message: 'Gagal membuat user' })
    }

    // Login Otomatis
    await setUserSession(event, {
      user: { id: newUser[0]!.id, nama: newUser[0]!.nama, email: newUser[0]!.email, role: newUser[0]!.role }
    })

    return { success: true }
  } catch (e: any) {
    throw createError({ statusCode: 400, message: 'Email atau NIM sudah terdaftar' })
  }
})
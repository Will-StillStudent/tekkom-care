import { createInterface } from 'readline'
import { db } from './db'
import { users } from '../database/schema'
import { hashAppPassword } from './password'
import { eq } from 'drizzle-orm'

const requiredFields = ['nama', 'nim', 'email', 'password'] as const

type RequiredField = (typeof requiredFields)[number]

type AdminInput = Record<RequiredField, string>

function parseArgv(): Partial<AdminInput> {
  const args = process.argv.slice(2)
  if (args.length < 8) {
    throw new Error('Argumen tidak lengkap. Gunakan --nama, --nim, --email, dan --password.')
  }

  const result: Partial<AdminInput> = {}

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (!arg!.startsWith('--')) continue
    const key = arg!.slice(2) as RequiredField
    const value = args[i + 1]
    if (requiredFields.includes(key) && value !== undefined && !value.startsWith('--')) {
      result[key] = value!
      i += 1
    }
  }

  return result
}

function validateEmail(email: string) {
  return email.endsWith('@students.undip.ac.id')
}

function validateNim(nim: string) {
  return /^\d{14}$/.test(nim)
}

function validatePassword(password: string) {
  const hasMinLen = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasSymbol = /[.\-_]/.test(password)
  return hasMinLen && hasUpper && hasSymbol
}

function ask(question: string) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function collectInput(): Promise<AdminInput> {
  const parsed = parseArgv()
  const input: Partial<AdminInput> = { ...parsed }

  for (const field of requiredFields) {
    if (!input[field]) {
      input[field] = await ask(`Masukkan ${field}: `)
    }
  }

  return input as AdminInput
}

async function ensureUnique(email: string, nim: string) {
  const existingByEmail = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existingByEmail.length > 0) {
    throw new Error(`Sudah ada user dengan email ${email}`)
  }

  const existingByNim = await db.select().from(users).where(eq(users.nim, nim)).limit(1)
  if (existingByNim.length > 0) {
    throw new Error(`Sudah ada user dengan NIM ${nim}`)
  }
}

async function main() {
  try {
    const { nama, nim, email, password } = await collectInput()

    if (!validateEmail(email)) {
      throw new Error('Email harus berakhiran @students.undip.ac.id')
    }
    if (!validateNim(nim)) {
      throw new Error('NIM harus berupa 14 digit angka')
    }
    if (!validatePassword(password)) {
      throw new Error('Password harus 8 karakter, memiliki huruf besar, dan simbol . atau - atau _')
    }

    await ensureUnique(email, nim)

    const hashedPassword = await hashAppPassword(password)

    const result = await db.insert(users).values({
      nama,
      nim,
      email,
      password: hashedPassword,
      role: 'admin'
    }).returning()

    if (!result || result.length === 0) {
      throw new Error('Gagal membuat akun admin')
    }

    console.log('\n✅ Akun admin berhasil dibuat:')
    console.log(`- id: ${result[0]!.id}`)
    console.log(`- nama: ${result[0]!.nama}`)
    console.log(`- email: ${result[0]!.email}`)
  } catch (error: any) {
    console.error('\n✗ Gagal membuat admin:', error.message || error)
    process.exit(1)
  }
}

main()

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../database/schema'

// Membuat file database nyata bernama sqlite.db di folder proyek Anda
const sqlite = new Database('sqlite.db')

// Export variabel 'db' agar bisa dipanggil langsung
export const db = drizzle(sqlite, { schema })
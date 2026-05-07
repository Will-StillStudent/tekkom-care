import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// server/database/schema.ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nama: text('nama').notNull(),
  nim: text('nim').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  // Tambahkan baris ini:
  role: text('role').$type<'user' | 'admin'>().default('user'),
})

export const complaints = sqliteTable('complaints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  judul: text('judul').notNull(),
  kategori: text('kategori').notNull(),
  lokasi: text('lokasi').notNull(),
  deskripsi: text('deskripsi').notNull(),
  status: text('status').$type<'Pending' | 'Diproses' | 'Selesai' | 'Ditolak'>().default('Pending'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})


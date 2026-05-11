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

// server/database/schema.ts
export const complaints = sqliteTable('complaints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  judul: text('judul').notNull(),
  kategori: text('kategori').notNull(),
  lokasi: text('lokasi').notNull(),
  deskripsi: text('deskripsi').notNull(),
  status: text('status').$type<'Pending' | 'Diproses' | 'Selesai' | 'Ditolak'>().default('Pending'),
  gambar: text('gambar'),
  // Tambahkan baris ini untuk menampung balasan admin
  tanggapanAdmin: text('tanggapan_admin'), 
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})

// server/database/schema.ts

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id), // Penerima notif
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link').notNull(), // URL tujuan saat diklik (misal: /aduan-saya/5)
  isRead: integer('is_read').default(0), // 0: belum dibaca, 1: sudah
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
})




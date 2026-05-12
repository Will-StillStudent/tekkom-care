# TekkomCare - Sistem Manajemen Pengaduan

TekkomCare adalah aplikasi web untuk mengelola pengaduan dan keluhan dari mahasiswa Teknik Komputer UNDIP. Platform ini memungkinkan mahasiswa untuk membuat pengaduan, melacak status, dan menerima notifikasi real-time, sementara admin dapat mengelola dan merespons pengaduan dengan efisien.

## Fitur Utama

- **Buat Pengaduan**: Mahasiswa dapat membuat pengaduan baru dengan kategori, lokasi, dan deskripsi
- **Dashboard Admin**: Admin dapat melihat statistik dan mengelola semua pengaduan
- **Notifikasi Real-time**: Sistem notifikasi untuk update pengaduan
- **Autentikasi Aman**: Login dengan email UNDIP dan password terenkripsi
- **Role-based Access**: Pembedaan hak akses antara admin dan user
- **Responsive Design**: Desain mobile-friendly dengan sidebar yang dapat dikontrol

## _Tech Stack_

- **Framework**: Nuxt 4
- **Database**: SQLite dengan Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Icons**: Phosphor Icons
- **Authentication**: Nuxt Auth Utils
- **Password Hashing**: bcrypt

## Setup

Pastikan semua dependencies terinstall:

```bash
npm install
```

## Development Server

Jalankan development server di `http://localhost:3000`:

```bash
npm run dev
```

## Migrasi Password (PENTING!!!)

Jika Anda memiliki pengguna dengan password plaintext di database, jalankan script migrasi untuk mengenkripsi semua password:

```bash
npx tsx server/utils/migrate-passwords.ts
```

Script ini akan:
- Mendeteksi password yang sudah terenkripsi (tidak akan diubah)
- Mengenkripsi semua password plaintext menggunakan bcrypt
- Menampilkan ringkasan hasil migrasi

## Production

Build aplikasi untuk production:

```bash
npm run build
```

Preview build secara lokal:

```bash
npm run preview
```

Untuk informasi deployment lebih lanjut, lihat [dokumentasi Nuxt](https://nuxt.com/docs/getting-started/deployment).

## Struktur Proyek

```
tekkom-care/
├── pages/              # Vue pages (routing otomatis)
├── server/
│   ├── api/            # API endpoints
│   ├── database/       # Schema dan migrations
│   └── utils/          # Utility functions (password, db)
├── layouts/            # Layout components
├── middleware/         # Auth middleware
└── assets/            # CSS dan static files
```
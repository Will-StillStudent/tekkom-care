# 🛠️ TekkomCare - Sistem Manajemen Pengaduan Fasilitas

TekkomCare adalah aplikasi web modern yang dirancang khusus untuk mengelola pengaduan dan keluhan fasilitas dari mahasiswa Teknik Komputer Universitas Diponegoro. Platform ini menjembatani mahasiswa (User) dan pengelola departemen (Admin) untuk mewujudkan proses perbaikan fasilitas kampus yang lebih cepat, transparan, dan efisien.

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-green?style=for-the-badge&logo=nuxt.js)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)

---

## ✨ Fitur Utama

### 👨‍🎓 Sisi Mahasiswa (User)
- **Otentikasi Kampus Ketat**: 
  - Registrasi wajib menggunakan Email Resmi UNDIP (`@students.undip.ac.id`).
  - Validasi NIM wajib 14 digit angka.
  - Keamanan password minimal 8 karakter, disertai huruf Kapital dan karakter unik (`.`, `-`, atau `_`).
- **Sistem Pengaduan**: Membuat laporan dengan kategori (Fasilitas, SDM, Lingkungan) dan lokasi spesifik.
- **Upload Foto Bukti**: Mendukung unggah foto bukti kerusakan dengan fitur *Drag & Drop*.
- **Pelacakan Real-time**: Memantau status aduan (*Pending*, *Diproses*, *Selesai*, atau *Ditolak*).
- **Notifikasi Lonceng**: Mendapatkan pemberitahuan instan saat admin memberikan tanggapan.

### 👨‍💼 Sisi Administrator (Admin)
- **Dashboard Analitik**: Melihat statistik total aduan dan distribusi kategori secara visual.
- **Manajemen Aduan Global**: Mengelola seluruh laporan dari satu tabel terpusat.
- **Quick Action**: Mengubah status aduan dan memberikan tanggapan teknis langsung di halaman kelola.
- **Sistem Pencarian & Filter**: Mencari aduan berdasarkan judul atau lokasi kejadian dengan cepat.

---

## 🚀 _Tech Stack_
- **Framework**: Nuxt 4 (Preview) / Vue 3
- **Database**: SQLite dengan Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Icons**: Phosphor Icons (@nuxt/icon)
- **Authentication**: Nuxt Auth Utils (Session Based)
- **Password Hashing**: bcrypt
- **File Storage**: Local File System Storage (`/public/uploads`)

---

## 🛠️ Panduan Instalasi & Setup

### Instalasi Dependencies
Pastikan Node.js (Versi 18+) sudah terinstall di komputer Anda:

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

## Credits

**Yusuf Afaf Nur Abdillah** (UI/UX Designer)
**Willybrordus Anugrah Gusti** (Front-End Developer)
**Reizal Haidar Akmal** (Back-End Developer)
**Muhammad Habiburrahman** (Project Manager, Quality Assurance)
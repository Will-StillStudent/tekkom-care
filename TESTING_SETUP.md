# Panduan Pengujian Tekkom-Care

## 1. Perangkat Lunak dan Tools yang Digunakan

### Software yang Diperlukan:
1. **Node.js & npm** - Runtime JavaScript dan package manager
2. **VS Code** - Code editor untuk development
3. **Terminal** - PowerShell/Command Prompt (Windows) atau Terminal (Linux/Mac)
4. **Browser** - Chrome atau Firefox untuk testing aplikasi
5. **Database** - SQLite (embedded) atau MySQL (opsional untuk production)
6. **Git** - Version control (opsional)

### Tools Opsional:
- **Postman** - Untuk testing API endpoints
- **DBeaver** - Database management tools
- **phpMyAdmin/MySQL Workbench** - Jika menggunakan MySQL

---

## 2. Konfigurasi Awal dan Setup Proyek

### 2.1 Persiapan Folder Proyek
```
Pastikan folder proyek tekkom-care sudah tersimpan di direktori lokal:
C:\tekkom-care (Windows)
atau
~/tekkom-care (Linux/Mac)
```

### 2.2 Instalasi Dependencies
Buka terminal PowerShell/Command Prompt dan jalankan:

```bash
# Navigasi ke folder proyek
cd C:\tekkom-care

# Install semua dependencies
npm install
```

### 2.3 Konfigurasi Environment Variables
Buat file `.env` di root folder proyek dengan konfigurasi database:

```env
# Database Configuration
DATABASE_URL="file:./server/database/data.db"

# Application
NUXT_PUBLIC_API_BASE="http://localhost:3000"
```

### 2.4 Setup Database & Migrasi
Jalankan migrasi database untuk membuat tabel-tabel yang diperlukan:

```bash
# Jalankan migrasi database (jika ada npm script)
npm run db:push
```

---

## 3. Menjalankan Aplikasi

### 3.1 Development Mode
Buka terminal di folder proyek dan jalankan:

```bash
# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

### 3.2 Production Build (Opsional)
Jika ingin melakukan testing di production mode:

```bash
# Build aplikasi
npm run build

# Jalankan production
npm run preview
```

---

## 4. Akses Aplikasi

### 4.1 Via Browser
1. Buka browser (Chrome/Firefox)
2. Masukkan URL: **http://localhost:3000**
3. Aplikasi akan memuat halaman awal

### 4.2 Status Aplikasi
- **Server berjalan**: Jika tidak ada error di terminal
- **Database siap**: Jika migrasi berhasil dilakukan
- **API endpoints**: Dapat diakses melalui `http://localhost:3000/api/*`

---

## 5. Prosedur Pengujian (Black-Box Testing)

### 5.1 Testing Authentication (Login & Register)

#### Test Case 1: Registrasi User Baru
**Endpoint:** `POST /api/auth/register`

```
1. Buka halaman http://localhost:3000/register
2. Isi form pendaftaran:
   - Username: "pengguna_test"
   - Email: "pengguna@test.com"
   - Password: "TestPassword123!"
   - Confirm Password: "TestPassword123!"
3. Klik tombol "Daftar"
4. Validasi:
   ✓ User berhasil terdaftar
   ✓ Redirect ke halaman login
   ✓ Data tersimpan di database
```

#### Test Case 2: Login User
**Endpoint:** `POST /api/auth/login`

```
1. Buka halaman http://localhost:3000/login
2. Masukkan kredensial:
   - Email: "pengguna@test.com"
   - Password: "TestPassword123!"
3. Klik tombol "Login"
4. Validasi:
   ✓ Login berhasil
   ✓ Redirect ke dashboard/home
   ✓ Session/token tersimpan
   ✓ User dapat mengakses halaman yang dilindungi
```

#### Test Case 3: Invalid Login
```
1. Coba login dengan email yang tidak terdaftar
2. Coba login dengan password salah
3. Validasi:
   ✓ Muncul pesan error yang sesuai
   ✓ User tidak berhasil login
```

---

### 5.2 Testing Fitur Pembuatan Aduan (Complaint)

#### Test Case 4: Membuat Aduan Baru
**Endpoint:** `POST /api/complaints/create`

```
1. Login terlebih dahulu
2. Buka halaman http://localhost:3000/buat-aduan
3. Isi form aduan:
   - Judul: "Jaringan Internet Tidak Stabil"
   - Deskripsi: "Internet sering putus pada pukul 14:00-16:00 setiap hari"
   - Kategori: "Infrastruktur" (jika ada)
   - Lampiran: Upload file (opsional)
4. Klik tombol "Kirim Aduan"
5. Validasi:
   ✓ Aduan berhasil dibuat
   ✓ Mendapatkan ID aduan unik
   ✓ Status awal: "Pending" atau "Terima"
   ✓ Timestamp terisi dengan benar
   ✓ Data tersimpan di database
```

#### Test Case 5: Melihat Daftar Aduan Saya
**Endpoint:** `GET /api/complaints/user`

```
1. Login sebagai user biasa
2. Buka halaman http://localhost:3000/aduan-saya
3. Validasi:
   ✓ Menampilkan semua aduan yang dibuat user
   ✓ Menampilkan status setiap aduan
   ✓ Dapat melihat detail aduan dengan klik
   ✓ Data sesuai dengan database
```

#### Test Case 6: Melihat Detail Aduan
**Endpoint:** `GET /api/complaints/[id]`

```
1. Dari halaman "Aduan Saya", klik salah satu aduan
2. URL akan berubah ke: http://localhost:3000/aduan-saya/{id}
3. Validasi:
   ✓ Menampilkan detail aduan lengkap
   ✓ Menampilkan tanggal pembuatan
   ✓ Menampilkan status terkini
   ✓ Menampilkan respons/komentar (jika ada)
```

---

### 5.3 Testing Fitur Admin

#### Test Case 7: Login sebagai Admin
```
1. Login dengan kredensial admin:
   - Email: "admin@tekkomcare.com"
   - Password: "AdminPassword123!"
2. Validasi:
   ✓ Berhasil login
   ✓ Dapat mengakses halaman http://localhost:3000/admin
   ✓ Menu admin visible
```

#### Test Case 8: Melihat Statistik Aduan
**Endpoint:** `GET /api/admin/stats`

```
1. Login sebagai admin
2. Buka halaman http://localhost:3000/admin
3. Validasi:
   ✓ Menampilkan total jumlah aduan
   ✓ Menampilkan breakdown status (Pending, In Progress, Resolved, Closed)
   ✓ Menampilkan statistik user (total, aktif, inactive)
   ✓ Data real-time dan akurat
```

#### Test Case 9: Kelola Semua Aduan
**Endpoint:** `GET /api/admin/all`

```
1. Login sebagai admin
2. Buka halaman http://localhost:3000/admin/kelola
3. Validasi:
   ✓ Menampilkan daftar semua aduan dari semua user
   ✓ Menampilkan kolom: ID, Judul, User, Status, Tanggal
   ✓ Dapat search/filter aduan
   ✓ Dapat klik detail untuk melihat/edit
```

#### Test Case 10: Update Status Aduan
**Endpoint:** `POST /api/admin/update-aduan`

```
1. Login sebagai admin
2. Buka detail aduan yang ingin diupdate
3. Ubah status aduan:
   - Dari "Pending" menjadi "In Progress"
   - Tambahkan respons: "Aduan sedang ditangani oleh tim teknis"
4. Klik "Simpan" atau "Update"
5. Validasi:
   ✓ Status berhasil diupdate
   ✓ Timestamp update tersimpan
   ✓ Notifikasi terkirim ke user pembuat aduan
   ✓ Perubahan visible di halaman aduan user
```

---

### 5.4 Testing Notifikasi

#### Test Case 11: Notifikasi untuk User
**Endpoint:** `GET /api/notifications/index`

```
1. Login sebagai user biasa
2. Lihat bell icon atau notifikasi area
3. Validasi:
   ✓ Notifikasi muncul saat admin merespons aduan
   ✓ Notifikasi menampilkan pesan yang relevan
   ✓ Dapat menandai notifikasi sebagai "dibaca"
```

#### Test Case 12: Mark Notification as Read
**Endpoint:** `POST /api/notifications/mark-read`

```
1. Login sebagai user
2. Buka halaman notifikasi
3. Klik "Tandai sebagai dibaca"
4. Validasi:
   ✓ Notifikasi status berubah menjadi "dibaca"
   ✓ Indikator notifikasi berkurang
```

---

### 5.5 Testing User Statistics

#### Test Case 13: Statistik User
**Endpoint:** `GET /api/user/stats`

```
1. Login sebagai user
2. Akses dashboard atau profil user
3. Validasi:
   ✓ Menampilkan jumlah aduan yang dibuat
   ✓ Menampilkan aduan yang sudah diselesaikan
   ✓ Menampilkan aduan pending
```

---

## 6. Testing API Endpoints (Opsional dengan Postman)

### 6.1 Setup Postman
```
1. Download dan install Postman
2. Import atau buat request untuk setiap endpoint:
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/complaints/create
   - GET /api/complaints/[id]
   - GET /api/complaints/user
   - GET /api/admin/all
   - POST /api/admin/update-aduan
3. Set base URL: http://localhost:3000
```

### 6.2 Contoh Request Postman

**Register User:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "TestPassword123!"
}
```

**Create Complaint:**
```
POST http://localhost:3000/api/complaints/create
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Jaringan Internet Tidak Stabil",
  "description": "Internet sering putus pada pukul 14:00-16:00",
  "category": "Infrastruktur"
}
```

---

## 7. Validasi Database

### 7.1 Membuka Database via Terminal
```bash
# Jika menggunakan SQLite, bisa menggunakan sqlite3
sqlite3 ./server/database/data.db

# Atau gunakan DBeaver untuk GUI
```

### 7.2 Query Validasi Data
```sql
-- Lihat semua user
SELECT id, email, created_at FROM user;

-- Lihat semua aduan
SELECT id, title, status, created_at FROM complaints;

-- Lihat aduan user tertentu
SELECT * FROM complaints WHERE user_id = 1;

-- Lihat notifikasi
SELECT * FROM notifications WHERE user_id = 1;
```

---

## 8. Troubleshooting

### 8.1 Error: "Port 3000 sudah digunakan"
```bash
# Ubah port di konfigurasi atau kill process yang menggunakan port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### 8.2 Error: "Database connection failed"
```
✓ Pastikan file .env sudah dibuat dengan benar
✓ Pastikan DATABASE_URL pointing ke file database yang tepat
✓ Jalankan npm run db:push untuk setup database
```

### 8.3 Error: "Module not found"
```bash
# Clear node_modules dan reinstall
rm -r node_modules
npm install
```

### 8.4 Migrasi Database Gagal
```bash
# Reset database dan jalankan migrasi ulang
npm run db:reset
npm run db:push
```

---

## 9. Checklist Testing Lengkap

- [ ] Setup environment dan install dependencies
- [ ] Database berhasil di-setup
- [ ] Aplikasi berjalan di http://localhost:3000
- [ ] Test registrasi user baru
- [ ] Test login dengan user yang valid
- [ ] Test login dengan user yang invalid
- [ ] Test membuat aduan baru
- [ ] Test melihat daftar aduan saya
- [ ] Test melihat detail aduan
- [ ] Test login sebagai admin
- [ ] Test melihat statistik admin
- [ ] Test update status aduan sebagai admin
- [ ] Test notifikasi sistem
- [ ] Validasi data di database
- [ ] Test semua API endpoints via Postman (opsional)
- [ ] Test responsivitas di berbagai browser

---

## 10. Kontak & Support

Jika ada error atau pertanyaan, periksakan:
1. Console browser (F12 → Console tab)
2. Terminal output saat menjalankan `npm run dev`
3. Database logs (jika ada)
4. Review environment variables di file `.env`

---

**Catatan:** Panduan ini menggunakan black-box testing, sehingga tidak memerlukan pengetahuan tentang kode internal. Cukup fokus pada input yang diberikan dan output yang diharapkan sesuai dengan requirement aplikasi.

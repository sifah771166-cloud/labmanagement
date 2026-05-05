# 📁 Struktur Folder - Lab Management System

## Struktur Direktori

```
ter-main/
├── config/                    # Konfigurasi aplikasi
│   └── config.js             # File konfigurasi utama
│
├── data/                      # Database dan data persisten
│   └── lab.db                # SQLite database
│
├── docs/                      # Dokumentasi proyek
│   ├── API_DOCUMENTATION.md
│   ├── PWA_IMPLEMENTATION_GUIDE.md
│   ├── REKOMENDASI_PROFESIONAL.md
│   ├── SUMMARY_PERUBAHAN.md
│   └── UPDATE_LOG.md
│
├── logs/                      # Log aplikasi
│   └── .gitkeep
│
├── public/                    # Frontend files (served statically)
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css      # Stylesheet utama
│   │   ├── js/
│   │   │   └── app.js        # JavaScript utama
│   │   └── images/           # Gambar dan icon
│   ├── index.html            # Halaman utama aplikasi
│   └── login.html            # Halaman login
│
├── server/                    # Backend code (untuk future refactoring)
│   ├── routes/               # Route handlers
│   ├── middleware/           # Custom middleware
│   └── database/             # Database utilities
│
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies
├── README.md                 # Dokumentasi utama
└── server.js                 # Entry point server

```

## Penjelasan Folder

### `/config`
Berisi file konfigurasi aplikasi seperti database path, port, secret keys, dll.

**Files:**
- `config.js` - Konfigurasi utama yang membaca dari environment variables

### `/data`
Menyimpan database SQLite dan file data lainnya.

**Files:**
- `lab.db` - Database SQLite (auto-generated saat pertama kali run)

**Note:** Folder ini di-ignore di git untuk keamanan data.

### `/docs`
Dokumentasi lengkap proyek.

**Files:**
- `API_DOCUMENTATION.md` - Dokumentasi API endpoints
- `PWA_IMPLEMENTATION_GUIDE.md` - Panduan implementasi PWA
- `REKOMENDASI_PROFESIONAL.md` - Rekomendasi pengembangan
- `SUMMARY_PERUBAHAN.md` - Changelog lengkap
- `UPDATE_LOG.md` - Log update versi

### `/logs`
Menyimpan log aplikasi (error logs, access logs, dll).

**Note:** Folder ini di-ignore di git. Hanya `.gitkeep` yang di-commit.

### `/public`
File-file yang di-serve langsung ke client (HTML, CSS, JS, images).

**Structure:**
- `/assets/css/` - Stylesheet files
- `/assets/js/` - JavaScript files
- `/assets/images/` - Images, icons, logos
- `index.html` - Main application page
- `login.html` - Login page

### `/server` (Future Use)
Untuk refactoring backend code menjadi modular.

**Planned Structure:**
- `/routes/` - Route handlers (auth.js, kunjungan.js, peminjaman.js, barang.js)
- `/middleware/` - Custom middleware (auth.js, validation.js)
- `/database/` - Database utilities (db.js, migrations/)

**Note:** Saat ini masih menggunakan `server.js` monolithic. Refactoring ke struktur ini adalah next step.

## Keuntungan Struktur Baru

### ✅ Separation of Concerns
- Frontend (public/) terpisah dari backend (server.js)
- Config terpisah dari code
- Data terpisah dari code
- Dokumentasi terpisah dari code

### ✅ Scalability
- Mudah menambah route baru di `/server/routes/`
- Mudah menambah middleware di `/server/middleware/`
- Mudah menambah dokumentasi di `/docs/`

### ✅ Security
- Database di folder terpisah (`/data/`)
- Config menggunakan environment variables
- Logs di folder terpisah (`/logs/`)
- Semua sensitive files di-ignore di git

### ✅ Maintainability
- Struktur jelas dan mudah dipahami
- File terorganisir berdasarkan fungsi
- Mudah mencari file yang dibutuhkan

### ✅ Professional
- Mengikuti best practices Node.js
- Struktur standar industri
- Mudah di-onboard developer baru

## Migration dari Struktur Lama

### Perubahan Path

**CSS:**
- Old: `public/style.css`
- New: `public/assets/css/main.css`

**JavaScript:**
- Old: `public/script.js`
- New: `public/assets/js/app.js`

**Database:**
- Old: `./lab.db`
- New: `./data/lab.db`

**Dokumentasi:**
- Old: `./API_DOCUMENTATION.md`
- New: `./docs/API_DOCUMENTATION.md`

### File yang Dihapus

- ❌ `README_old.md` - Backup tidak diperlukan
- ❌ `public/index_old.html` - Backup tidak diperlukan
- ❌ `public/script_old.js` - Backup tidak diperlukan
- ❌ `public/style_old.css` - Backup tidak diperlukan

### File yang Ditambahkan

- ✅ `config/config.js` - Konfigurasi terpusat
- ✅ `.env.example` - Template environment variables
- ✅ `logs/.gitkeep` - Placeholder untuk folder logs
- ✅ `docs/FOLDER_STRUCTURE.md` - Dokumentasi ini

## Next Steps

### 1. Refactor server.js (Optional)
Pisahkan `server.js` menjadi modular:

```
server/
├── server.js              # Entry point
├── routes/
│   ├── auth.js           # Login, logout
│   ├── kunjungan.js      # CRUD kunjungan
│   ├── peminjaman.js     # CRUD peminjaman
│   ├── barang.js         # CRUD barang
│   └── stats.js          # Dashboard stats
├── middleware/
│   ├── auth.js           # authenticate, requireAdmin
│   └── validation.js     # Input validation
└── database/
    └── db.js             # Database connection
```

### 2. Implementasi PWA
Tambahkan file PWA:
- `public/manifest.json`
- `public/sw.js` (Service Worker)
- `public/assets/images/icon-192.png`
- `public/assets/images/icon-512.png`

### 3. Environment Variables
Buat file `.env` dari `.env.example` dan sesuaikan:
```bash
cp .env.example .env
# Edit .env dengan nilai yang sesuai
```

### 4. Testing
Tambahkan folder testing:
```
tests/
├── unit/
│   ├── auth.test.js
│   ├── kunjungan.test.js
│   └── peminjaman.test.js
└── integration/
    └── api.test.js
```

## Catatan Penting

⚠️ **Setelah reorganisasi:**
1. Pastikan semua path di HTML sudah update
2. Pastikan database path di server.js sudah update
3. Test semua fitur untuk memastikan tidak ada broken links
4. Commit perubahan ke git

✅ **Struktur ini sudah production-ready** dan mengikuti best practices!

---

**Dibuat:** 30 April 2026  
**Versi:** 2.2  
**Status:** ✅ Implemented

# 🏫 Lab Management System v2.2

Sistem manajemen laboratorium untuk monitoring kunjungan dan peminjaman barang dengan fitur autentikasi user dan super admin. Dilengkapi dengan role-based access control dan dashboard yang disesuaikan untuk setiap role.

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- **Login System** dengan role-based access (User & Super Admin)
- **Token-based Authentication** untuk keamanan
- **Session Management** dengan localStorage
- **Password Hashing** dengan SHA-256

### 📊 Dashboard Interaktif

#### Dashboard Admin:
- Total kunjungan dan peminjaman
- Peminjaman aktif real-time
- Monitoring stok barang rendah
- Kunjungan hari ini
- Chart top 5 barang paling sering dipinjam

#### Dashboard User:
- 📢 Pengumuman dan informasi terkini
- ℹ️ Informasi penting tentang penggunaan lab
- 💡 Tips penggunaan sistem

### 👥 Manajemen Kunjungan
- Tambah data kunjungan dengan 5 field:
  - Nama Guru
  - Kelas yang Diajar
  - Jam Mulai
  - Jam Selesai
  - Tanggal
- Search & filter data kunjungan
- Edit data kunjungan (User & Admin)
- Hapus data kunjungan (Admin only)
- Export data ke CSV

### 📦 Manajemen Peminjaman
- Tambah peminjaman dengan validasi stok
- Filter berdasarkan status (Dipinjam/Kembali)
- Search peminjam atau barang
- Tandai barang sudah dikembalikan (User & Admin)
- Edit peminjaman (Admin only)
- Hapus peminjaman (Admin only)
- Auto-update stok barang
- Export data ke CSV

### 🏷️ Manajemen Barang (Admin Only)
- CRUD lengkap untuk data barang
- Edit inline dengan form yang sama
- Search barang by nama atau kode
- Validasi stok dan kode unik
- Highlight stok rendah (< 5)
- Export data ke CSV

### 📄 Laporan (Admin Only)
- Export semua data ke format CSV
- Print laporan lengkap dengan statistik
- Preview laporan sebelum print

### 🎨 UI/UX Modern
- Responsive design (Mobile, Tablet, Desktop)
- Gradient color scheme yang menarik (Purple-Blue)
- Smooth animations dan transitions
- Loading indicators
- Toast notifications
- Touch-friendly buttons (44x44px minimum)
- Toast notifications
- Icon-based navigation

## 🚀 Instalasi

### Prerequisites
- Node.js (v14 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone atau download project**
```bash
cd ter-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan server**
```bash
npm start
```

4. **Buka browser**
```
http://localhost:3000/login.html
```

## 👤 Default Accounts

### User Account
- **Username:** `user`
- **Password:** `user123`
- **Role:** User
- **Akses:** 
  - ✅ Dashboard (Informasi & Pengumuman)
  - ✅ Kunjungan (Tambah, Edit, Lihat)
  - ✅ Peminjaman (Tambah, Kembali, Lihat)
  - ❌ Barang
  - ❌ Laporan
  - ❌ Hapus data

### Super Admin Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin
- **Akses:** 
  - ✅ Dashboard (Statistik Lengkap)
  - ✅ Kunjungan (Full CRUD)
  - ✅ Peminjaman (Full CRUD)
  - ✅ Barang (Full CRUD)
  - ✅ Laporan (Export & Print)
  - ✅ Hapus semua data

## 🔐 Role-Based Access Control

| Fitur | User | Admin |
|-------|------|-------|
| **Dashboard** | Informasi & Pengumuman | Statistik Lengkap |
| **Kunjungan - Tambah** | ✅ | ✅ |
| **Kunjungan - Edit** | ✅ | ✅ |
| **Kunjungan - Hapus** | ❌ | ✅ |
| **Peminjaman - Tambah** | ✅ | ✅ |
| **Peminjaman - Edit** | ❌ | ✅ |
| **Peminjaman - Kembali** | ✅ | ✅ |
| **Peminjaman - Hapus** | ❌ | ✅ |
| **Barang - Akses** | ❌ | ✅ |
| **Laporan - Akses** | ❌ | ✅ |

## 📁 Struktur Project

```
ter-main/
├── config/                    # Konfigurasi aplikasi
│   └── config.js             # File konfigurasi utama
├── data/                      # Database dan data persisten
│   └── lab.db                # SQLite database (auto-generated)
├── docs/                      # Dokumentasi proyek
│   ├── API_DOCUMENTATION.md
│   ├── FOLDER_STRUCTURE.md
│   ├── PWA_IMPLEMENTATION_GUIDE.md
│   ├── REKOMENDASI_PROFESIONAL.md
│   ├── REORGANIZATION_COMPLETE.md
│   ├── SUMMARY_PERUBAHAN.md
│   └── UPDATE_LOG.md
├── logs/                      # Log aplikasi
│   └── .gitkeep
├── public/                    # Frontend files
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css      # Stylesheet utama
│   │   ├── js/
│   │   │   └── app.js        # JavaScript utama
│   │   └── images/           # Gambar dan icon
│   ├── index.html            # Halaman utama aplikasi
│   └── login.html            # Halaman login
├── server/                    # Backend structure (untuk future refactoring)
│   ├── routes/               # Route handlers
│   ├── middleware/           # Custom middleware
│   └── database/             # Database utilities
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules
├── package.json              # NPM dependencies
├── README.md                 # Dokumentasi utama
└── server.js                 # Entry point server
```

**Dokumentasi lengkap struktur:** Lihat `docs/FOLDER_STRUCTURE.md`

## 🗄️ Database Schema

### Table: users
- `id` - Primary key
- `username` - Username unik
- `password` - Password (hashed dengan SHA-256)
- `role` - Role user (user/admin)
- `token` - Session token
- `created_at` - Timestamp

### Table: barang
- `id` - Primary key
- `nama` - Nama barang
- `kode` - Kode barang (unique)
- `stok` - Jumlah stok
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Table: kunjungan
- `id` - Primary key
- `nama_guru` - Nama guru yang mengajar
- `kelas_diajar` - Kelas yang diajar
- `jam_mulai` - Jam mulai mengajar (HH:MM)
- `jam_selesai` - Jam selesai mengajar (HH:MM)
- `tanggal` - Tanggal kunjungan
- `created_at` - Timestamp
- `created_at` - Timestamp

### Table: peminjaman
- `id` - Primary key
- `nama` - Nama peminjam
- `barang_id` - Foreign key ke barang
- `jumlah` - Jumlah dipinjam
- `status` - Status (dipinjam/kembali)
- `waktu_pinjam` - Waktu peminjaman
- `waktu_kembali` - Waktu pengembalian
- `created_at` - Timestamp

## 🔌 API Endpoints

### Authentication
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user info

### Barang (Admin only)
- `GET /barang?search=` - Get all barang
- `POST /barang` - Create barang
- `PUT /barang/:id` - Update barang
- `DELETE /barang/:id` - Delete barang

### Kunjungan
- `GET /kunjungan?search=` - Get all kunjungan
- `POST /kunjungan` - Create kunjungan
- `DELETE /kunjungan/:id` - Delete kunjungan

### Peminjaman
- `GET /peminjaman?search=&status=` - Get all peminjaman
- `POST /peminjaman` - Create peminjaman
- `PUT /peminjaman/:id` - Return peminjaman
- `DELETE /peminjaman/:id` - Delete peminjaman

### Dashboard
- `GET /stats` - Get dashboard statistics

## 🛡️ Security Features

- ✅ Password hashing dengan SHA-256
- ✅ Token-based authentication
- ✅ Role-based access control
- ✅ Input validation di frontend dan backend
- ✅ SQL injection prevention dengan parameterized queries
- ✅ CORS enabled untuk API security
- ✅ Session management

## 🎯 Fitur Validasi

- ✅ Validasi stok sebelum peminjaman
- ✅ Validasi kode barang unik
- ✅ Validasi input required fields
- ✅ Validasi jumlah harus positif
- ✅ Validasi barang tidak bisa dihapus jika sedang dipinjam
- ✅ Auto-update stok saat peminjaman dan pengembalian

## 📱 Responsive Design

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)
- ✅ Print-friendly layout

## 🔧 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Ubah port di server.js baris terakhir
app.listen(3001, () => console.log("Server running at http://localhost:3001"));
```

### Database error
```bash
# Hapus file lab.db dan restart server untuk recreate database
rm lab.db
npm start
```

### Login tidak berfungsi
- Pastikan server sudah running
- Check console browser untuk error
- Clear localStorage: `localStorage.clear()`

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Sistem login dengan autentikasi
- ✅ Role-based access (User & Admin)
- ✅ Dashboard dengan statistik lengkap
- ✅ Manajemen barang (CRUD)
- ✅ Search & filter di semua tabel
- ✅ Export data ke CSV
- ✅ Print laporan
- ✅ Responsive design
- ✅ Loading indicators
- ✅ Toast notifications
- ✅ Improved UI/UX

### Version 1.0.0
- Basic kunjungan dan peminjaman
- Simple dashboard
- No authentication

## 👨‍💻 Developer

Dikembangkan dengan ❤️ menggunakan:
- **Backend:** Node.js + Express
- **Database:** SQLite3
- **Frontend:** Vanilla JavaScript
- **Styling:** Custom CSS dengan Gradient

## 📄 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Happy Coding! 🚀**

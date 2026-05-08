# Lab Management System v2.2

Sistem manajemen laboratorium berbasis web untuk monitoring kunjungan guru, peminjaman peralatan, dan manajemen stok barang.

## Ringkasan

- Multi-level access: `user` dan `admin`
- Dashboard yang berbeda untuk User dan Admin
- Manajemen kunjungan, peminjaman, dan barang
- Ekspor data ke CSV dan fitur print laporan
- Sistem autentikasi token dengan role-based access control
- UI responsif untuk desktop dan mobile


## Fitur Utama

### Autentikasi & Akses
- Login dengan username/password
- Token-based authorization untuk endpoint API
- Role-based access control: User vs Admin

### Manajemen Kunjungan
- Tambah/edit kunjungan
- Hapus kunjungan (Admin saja)
- Filter dan pencarian data
- Export data ke CSV

### Manajemen Peminjaman
- Tambah peminjaman dengan validasi stok
- Tandai barang kembali
- Edit/hapus peminjaman (Admin saja)
- Lihat status peminjaman aktif

### Manajemen Barang
- CRUD barang (Admin only)
- Validasi stok dan kode unik
- Highlight stok rendah
- Export ke CSV

### Laporan & Statistik
- Export laporan CSV
- Print laporan
- Statistik kunjungan dan peminjaman

## Instalasi

### Persyaratan
- Node.js v14+ 
- npm atau yarn

### Langkah
1. Masuk ke folder proyek
```bash
cd labmagement
```
2. Install dependencies
```bash
npm install
```
3. Jalankan server
```bash
npm start
```
4. Buka browser
```
http://localhost:3000/login.html
```

## Akun Default

### Admin
- `admin`
- `admin123`
- Akses lengkap: kunjungan, peminjaman, barang, laporan

### User
- `user`
- `user123`
- Akses terbatas: lihat dashboard, tambah/edit kunjungan, tambah/kembali peminjaman

## API Singkat

### Autentikasi
- `POST /login` - Login dan dapatkan token
- `POST /logout` - Logout
- `GET /me` - Info user saat ini

### Barang (Admin)
- `GET /barang` - List barang
- `POST /barang` - Tambah barang
- `PUT /barang/:id` - Update barang
- `DELETE /barang/:id` - Hapus barang

### Kunjungan
- `GET /kunjungan` - List kunjungan
- `POST /kunjungan` - Tambah kunjungan
- `PUT /kunjungan/:id` - Edit kunjungan
- `DELETE /kunjungan/:id` - Delete kunjungan (Admin)

### Peminjaman
- `GET /peminjaman` - List peminjaman
- `POST /peminjaman` - Tambah peminjaman
- `PUT /peminjaman/:id` - Update status peminjaman
- `DELETE /peminjaman/:id` - Delete peminjaman (Admin)

## Struktur Proyek

```
labmagement/
├── config/           # Konfigurasi aplikasi
│   └── config.js
├── data/             # Database dan data persisten
│   └── lab.db
├── logs/             # Folder log aplikasi
│   └── .gitkeep
├── public/           # Frontend
│   ├── assets/css/
│   │   └── main.css
│   ├── assets/js/
│   ├── assets/images/
│   ├── dashboard.html
│   └── login.html
├── server/           # Backend (future refactor)
│   ├── routes/
│   ├── middleware/
│   └── database/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Troubleshooting Singkat

### Server tidak jalan
- Pastikan dependencies terinstall
- Jalankan `npm install` lalu `npm start`
- Ganti port jika perlu di `.env`

### Error module hilang
- Hapus `node_modules`
- Jalankan `npm install`

### Database bermasalah
- Hapus `data/lab.db`
- Restart server untuk membuat ulang database

### Login tidak berhasil
- Gunakan default credentials
- Hapus `localStorage` / token di browser

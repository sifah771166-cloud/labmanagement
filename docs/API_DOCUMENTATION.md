# API Documentation - Lab Management System

Base URL: `http://localhost:3000`

## Authentication

All endpoints (except `/login`) require authentication via token in the `Authorization` header.

### Headers
```
Authorization: <token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### POST /login
Login user dan mendapatkan token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "abc123...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Username atau password salah"
}
```

---

### POST /logout
Logout user dan hapus token.

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "success": true
}
```

---

### GET /me
Get informasi user yang sedang login.

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

---

## 🏷️ Barang Endpoints (Admin Only)

### GET /barang
Get semua data barang dengan optional search.

**Headers:** Requires Authorization (Admin only)

**Query Parameters:**
- `search` (optional): Search by nama atau kode

**Example:** `/barang?search=laptop`

**Response Success (200):**
```json
[
  {
    "id": 1,
    "nama": "Laptop",
    "kode": "LAP001",
    "stok": 8,
    "created_at": "2026-04-30T10:00:00.000Z",
    "updated_at": "2026-04-30T10:00:00.000Z"
  }
]
```

---

### POST /barang
Tambah barang baru.

**Headers:** Requires Authorization (Admin only)

**Request Body:**
```json
{
  "nama": "Laptop",
  "kode": "LAP001",
  "stok": 10
}
```

**Response Success (201):**
```json
{
  "success": true,
  "id": 1
}
```

**Response Error (400):**
```json
{
  "error": "Kode barang sudah ada"
}
```

---

### PUT /barang/:id
Update data barang.

**Headers:** Requires Authorization (Admin only)

**Request Body:**
```json
{
  "nama": "Laptop Updated",
  "kode": "LAP001",
  "stok": 15
}
```

**Response Success (200):**
```json
{
  "success": true
}
```

---

### DELETE /barang/:id
Hapus barang.

**Headers:** Requires Authorization (Admin only)

**Response Success (200):**
```json
{
  "success": true
}
```

**Response Error (400):**
```json
{
  "error": "Barang sedang dipinjam, tidak bisa dihapus"
}
```

---

## 👥 Kunjungan Endpoints

### GET /kunjungan
Get semua data kunjungan dengan optional search.

**Headers:** Requires Authorization

**Query Parameters:**
- `search` (optional): Search by nama atau kelas

**Example:** `/kunjungan?search=ahmad`

**Response Success (200):**
```json
[
  {
    "id": 1,
    "nama": "Ahmad Rizki",
    "kelas": "XII RPL 1",
    "waktu": "2026-04-30T10:00:00.000Z",
    "created_at": "2026-04-30T10:00:00.000Z"
  }
]
```

---

### POST /kunjungan
Tambah data kunjungan.

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "nama": "Ahmad Rizki",
  "kelas": "XII RPL 1",
  "tanggal": "2026-04-30" // optional, default: today
}
```

**Response Success (201):**
```json
{
  "success": true,
  "id": 1
}
```

---

### DELETE /kunjungan/:id
Hapus data kunjungan.

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "success": true
}
```

---

## 📦 Peminjaman Endpoints

### GET /peminjaman
Get semua data peminjaman dengan optional search dan filter.

**Headers:** Requires Authorization

**Query Parameters:**
- `search` (optional): Search by nama peminjam atau nama barang
- `status` (optional): Filter by status (dipinjam/kembali)

**Example:** `/peminjaman?search=siti&status=dipinjam`

**Response Success (200):**
```json
[
  {
    "id": 1,
    "nama": "Siti Nurhaliza",
    "barang_id": 2,
    "barang_nama": "Laptop",
    "barang_kode": "LAP001",
    "jumlah": 2,
    "status": "dipinjam",
    "waktu_pinjam": "2026-04-30T10:00:00.000Z",
    "waktu_kembali": null,
    "created_at": "2026-04-30T10:00:00.000Z"
  }
]
```

---

### POST /peminjaman
Tambah peminjaman baru.

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "nama": "Siti Nurhaliza",
  "barang_id": 2,
  "jumlah": 2,
  "tanggal": "2026-04-30" // optional, default: today
}
```

**Response Success (201):**
```json
{
  "success": true,
  "id": 1
}
```

**Response Error (400):**
```json
{
  "error": "Stok Laptop tidak cukup. Tersedia: 1, Diminta: 2"
}
```

---

### PUT /peminjaman/:id
Tandai barang sudah dikembalikan.

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "success": true
}
```

**Response Error (400):**
```json
{
  "error": "Item sudah dikembalikan"
}
```

---

### DELETE /peminjaman/:id
Hapus data peminjaman (stok akan dikembalikan jika status masih dipinjam).

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "success": true
}
```

---

## 📊 Dashboard Endpoints

### GET /stats
Get statistik dashboard.

**Headers:** Requires Authorization

**Response Success (200):**
```json
{
  "totalKunjungan": 10,
  "totalPeminjaman": 15,
  "peminjamanAktif": 5,
  "totalBarang": 10,
  "barangStokRendah": 3,
  "kunjunganHariIni": 2,
  "topBarang": [
    {
      "nama": "Laptop",
      "total": 5
    },
    {
      "nama": "Camera",
      "total": 3
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Admin only"
}
```

### 404 Not Found
```json
{
  "error": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database error",
  "details": "..."
}
```

---

## Notes

1. **Token Management**: Token disimpan di localStorage di frontend
2. **Password Hashing**: Password di-hash menggunakan SHA-256
3. **Auto Stock Update**: Stok barang otomatis terupdate saat peminjaman dan pengembalian
4. **Validation**: Semua input divalidasi di backend
5. **CORS**: CORS enabled untuk development

---

## Testing dengan cURL

### Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Barang (dengan token)
```bash
curl http://localhost:3000/barang \
  -H "Authorization: YOUR_TOKEN_HERE"
```

### Tambah Kunjungan
```bash
curl -X POST http://localhost:3000/kunjungan \
  -H "Authorization: YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Ahmad","kelas":"XII RPL 1"}'
```

---

**Last Updated:** April 30, 2026

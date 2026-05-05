# 🎨 Panduan Visual - Lab Management System

## 📱 Tampilan Aplikasi

### 1. Halaman Login
```
┌─────────────────────────────────────┐
│                                     │
│     🔐 Lab Management System        │
│     Silakan login untuk melanjutkan │
│                                     │
│     ┌─────────────────────────┐    │
│     │ Username                │    │
│     └─────────────────────────┘    │
│                                     │
│     ┌─────────────────────────┐    │
│     │ Password                │    │
│     └─────────────────────────┘    │
│                                     │
│     ┌─────────────────────────┐    │
│     │        Login            │    │
│     └─────────────────────────┘    │
│                                     │
│     Default Accounts:               │
│     👤 User: user / user123         │
│     👑 Admin: admin / admin123      │
│                                     │
└─────────────────────────────────────┘
```

### 2. Dashboard Admin
```
┌─────────────────────────────────────────────────────────┐
│ Lab Management System                    👑 admin [Logout]│
│ Monitoring Kunjungan dan Peminjaman                      │
├─────────────────────────────────────────────────────────┤
│ [📊 Dashboard] [👥 Kunjungan] [📦 Peminjaman]           │
│ [🏷️ Barang] [📄 Laporan]                                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 👥  125  │  │ 📦  89   │  │ ⏳  12   │             │
│  │ Total    │  │ Total    │  │ Aktif    │             │
│  │ Kunjungan│  │ Peminjaman│  │ Peminjaman│            │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 🏷️  45   │  │ ⚠️  3    │  │ 📅  8    │             │
│  │ Total    │  │ Stok     │  │ Kunjungan│             │
│  │ Barang   │  │ Rendah   │  │ Hari Ini │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  📈 Top 5 Barang Paling Sering Dipinjam                │
│  ┌────────────────────────────────────────┐            │
│  │ Camera      ████████████████████ 45x   │            │
│  │ Laptop      ████████████████ 38x       │            │
│  │ Projector   ████████████ 28x           │            │
│  │ Microscope  ████████ 18x               │            │
│  │ Whiteboard  ████ 12x                   │            │
│  └────────────────────────────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3. Dashboard User
```
┌─────────────────────────────────────────────────────────┐
│ Lab Management System                     👤 user [Logout]│
│ Monitoring Kunjungan dan Peminjaman                      │
├─────────────────────────────────────────────────────────┤
│ [📊 Dashboard] [👥 Kunjungan] [📦 Peminjaman]           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📢 Pengumuman                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ Selamat Datang di Sistem Manajemen Lab        │    │
│  │                                                 │    │
│  │ Gunakan menu Kunjungan untuk mencatat          │    │
│  │ kunjungan mengajar Anda di laboratorium.       │    │
│  │                                                 │    │
│  │ Gunakan menu Peminjaman untuk meminjam         │    │
│  │ peralatan laboratorium.                         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ℹ️ Informasi Penting                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✓ Pastikan mengisi form kunjungan setiap kali │    │
│  │   mengajar di lab                               │    │
│  │ ✓ Peralatan yang dipinjam harus dikembalikan   │    │
│  │   tepat waktu                                   │    │
│  │ ✓ Hubungi admin jika ada kendala               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4. Halaman Kunjungan
```
┌─────────────────────────────────────────────────────────┐
│ 👥 Data Kunjungan                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐      │
│  │Nama Guru │ │Kelas     │ │Jam     │ │Jam     │      │
│  │          │ │Diajar    │ │Mulai   │ │Selesai │      │
│  └──────────┘ └──────────┘ └────────┘ └────────┘      │
│  ┌──────────┐ [➕ Tambah]                               │
│  │Tanggal   │                                           │
│  └──────────┘                                           │
│                                                          │
│  🔍 Cari nama guru atau kelas...                        │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Nama Guru │ Kelas │ Tanggal │ Jam │ Aksi       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Pak Budi  │ X-1   │02/05/26 │08:00│[✏️][🗑️]   │   │
│  │ Bu Ani    │ XI-2  │02/05/26 │10:00│[✏️][🗑️]   │   │
│  │ Pak Joko  │ XII-3 │01/05/26 │13:00│[✏️][🗑️]   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5. Halaman Peminjaman
```
┌─────────────────────────────────────────────────────────┐
│ 📦 Data Peminjaman                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────┐ ┌──────────┐ ┌──────┐ ┌────────┐            │
│  │Nama  │ │Pilih     │ │Jumlah│ │Tanggal │            │
│  │      │ │Barang    │ │      │ │        │            │
│  └──────┘ └──────────┘ └──────┘ └────────┘            │
│  [➕ Tambah]                                             │
│                                                          │
│  🔍 Cari...  [Filter: Semua Status ▼]                  │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Nama │ Barang │ Tanggal │ Jumlah │ Status │ Aksi│   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Budi │ Camera │02/05/26 │   2    │Dipinjam│[✓] │   │
│  │ Ani  │ Laptop │02/05/26 │   1    │Dipinjam│[✓] │   │
│  │ Joko │ Mouse  │01/05/26 │   3    │Kembali │    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 6. Halaman Barang (Admin Only)
```
┌─────────────────────────────────────────────────────────┐
│ 🏷️ Data Barang                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────┐                    │
│  │Nama      │ │Kode      │ │Stok  │                    │
│  │Barang    │ │Barang    │ │      │                    │
│  └──────────┘ └──────────┘ └──────┘                    │
│  [➕ Tambah]                                             │
│                                                          │
│  🔍 Cari nama atau kode barang...                       │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Nama       │ Kode    │ Stok │ Aksi              │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Camera     │ CAM001  │  5   │ [✏️ Edit][🗑️ Hapus]│   │
│  │ Laptop     │ LAP001  │  8   │ [✏️ Edit][🗑️ Hapus]│   │
│  │ Microscope │ MIC001  │  3   │ [✏️ Edit][🗑️ Hapus]│   │
│  │ Projector  │ PROJ001 │  2   │ [✏️ Edit][🗑️ Hapus]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7. Halaman Laporan (Admin Only)
```
┌─────────────────────────────────────────────────────────┐
│ 📄 Laporan                                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ 📥 Export Kunjungan  │  │ 📥 Export Peminjaman │    │
│  │      (CSV)           │  │      (CSV)           │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ 📥 Export Barang     │  │ 🖨️ Print Laporan     │    │
│  │      (CSV)           │  │                      │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Warna & Tema

### Color Palette
- **Primary**: #667eea (Ungu/Biru)
- **Secondary**: #764ba2 (Ungu Gelap)
- **Success**: #27ae60 (Hijau)
- **Danger**: #e74c3c (Merah)
- **Warning**: #f39c12 (Kuning)
- **Info**: #3498db (Biru)
- **Light**: #f5f7fa (Abu-abu Terang)
- **Dark**: #2c3e50 (Abu-abu Gelap)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Heading**: Bold, 22-28px
- **Body**: Regular, 14-16px
- **Small**: 12-13px

## 📱 Responsive Design

### Desktop (> 768px)
- Grid layout untuk cards
- Sidebar navigation
- Full table view

### Tablet (768px - 480px)
- Stacked cards
- Horizontal scroll untuk table
- Compact navigation

### Mobile (< 480px)
- Single column layout
- Card-based table
- Bottom navigation (optional)

## 🎯 User Experience

### Loading States
```
┌─────────────────────┐
│                     │
│    ⏳ Loading...    │
│    [Spinner]        │
│                     │
└─────────────────────┘
```

### Success Notification
```
┌─────────────────────────────┐
│ ✅ Data berhasil disimpan!  │
└─────────────────────────────┘
```

### Error Notification
```
┌─────────────────────────────┐
│ ❌ Gagal menyimpan data!    │
└─────────────────────────────┘
```

### Confirmation Dialog
```
┌─────────────────────────────┐
│ Yakin ingin menghapus data? │
│                             │
│   [Batal]      [Ya, Hapus]  │
└─────────────────────────────┘
```

## 🔄 User Flow

### Login Flow
```
Login Page → Enter Credentials → Validate → Dashboard
                                    ↓
                                  Error → Show Error Message
```

### Add Kunjungan Flow
```
Kunjungan Page → Fill Form → Submit → Validate → Save to DB → Refresh List
                                         ↓
                                       Error → Show Error Message
```

### Borrow Item Flow
```
Peminjaman Page → Select Item → Enter Quantity → Check Stock → Save → Update Stock
                                                      ↓
                                                  Insufficient → Show Error
```

### Return Item Flow
```
Peminjaman Page → Click Return → Confirm → Update Status → Update Stock → Refresh
```

## 🎨 Icon Guide

- 📊 Dashboard
- 👥 Kunjungan / Users
- 📦 Peminjaman / Items
- 🏷️ Barang / Inventory
- 📄 Laporan / Reports
- ✏️ Edit
- 🗑️ Delete
- ✓ Confirm / Return
- ➕ Add
- 🔍 Search
- 📥 Export
- 🖨️ Print
- ⏳ Loading / Pending
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 👑 Admin
- 👤 User
- 🔐 Login
- 📅 Date
- ⏰ Time

---

**Catatan:** Ini adalah representasi visual ASCII. Tampilan sebenarnya lebih modern dan profesional dengan CSS styling yang lengkap.

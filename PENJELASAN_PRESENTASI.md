# 📊 PENJELASAN PROYEK - LAB MANAGEMENT SYSTEM
## Dokumentasi untuk Presentasi

---

## 🎯 OVERVIEW PROYEK

**Lab Management System v2.2** adalah aplikasi web full-stack untuk mengelola laboratorium, mencakup monitoring kunjungan guru dan peminjaman barang dengan sistem autentikasi berbasis role (User & Admin).

### Teknologi Stack:
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Architecture**: RESTful API + MVC Pattern

---

## 📁 STRUKTUR FILE & FUNGSINYA

### 1️⃣ **ROOT FILES**

#### `server.js` (Entry Point Backend)
**Fungsi Utama:**
- **Server Setup**: Membuat Express server di port 3000
- **Database Connection**: Koneksi ke SQLite database (`lab.db`)
- **Middleware Configuration**:
  - `cors()` - Mengizinkan cross-origin requests
  - `body-parser` - Parsing JSON dan form data
  - `express.static('public')` - Serve static files
- **Authentication System**:
  - `hashPassword()` - Hash password dengan SHA-256
  - `authenticate()` - Middleware cek token
  - `requireAdmin()` - Middleware cek role admin
- **Database Schema**: Membuat 4 tabel utama
- **API Endpoints**: 15+ endpoints untuk CRUD operations

**Kode Penting:**
```javascript
// Hash password untuk keamanan
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Middleware autentikasi
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  // Validasi token dari database
  db.get("SELECT * FROM users WHERE token=?", [token], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
```

---

#### `package.json` (Dependency Management)
**Fungsi:**
- Mendefinisikan dependencies proyek
- Script untuk menjalankan aplikasi
- Metadata proyek (nama, versi, author)

**Dependencies Utama:**
- `express` - Web framework
- `sqlite3` - Database driver
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - Parse request body
- `dotenv` - Environment variables

**Scripts:**
```json
"start": "node server.js",      // Production
"dev": "nodemon server.js"      // Development (auto-reload)
```

---

### 2️⃣ **CONFIG FOLDER**

#### `config/config.js`
**Fungsi:**
- Centralized configuration management
- Environment variables handling
- Default values untuk development

**Konfigurasi:**
```javascript
module.exports = {
  server: {
    port: 3000,              // Port server
    host: 'localhost'        // Host server
  },
  database: {
    path: './data/lab.db'    // Path database SQLite
  },
  security: {
    jwtSecret: 'secret-key', // Secret untuk token
    sessionTimeout: 3600000  // 1 jam
  }
}
```

---

### 3️⃣ **DATA FOLDER**

#### `data/lab.db` (SQLite Database)
**Fungsi:**
- Menyimpan semua data aplikasi
- File-based database (tidak perlu MySQL/PostgreSQL)

**4 Tabel Utama:**

1. **`users`** - Data pengguna
   ```sql
   - id (PRIMARY KEY)
   - username (UNIQUE)
   - password (hashed)
   - role (user/admin)
   - token (untuk session)
   - created_at
   ```

2. **`barang`** - Data inventori
   ```sql
   - id (PRIMARY KEY)
   - nama
   - kode (UNIQUE)
   - stok
   - created_at, updated_at
   ```

3. **`kunjungan`** - Data kunjungan guru
   ```sql
   - id (PRIMARY KEY)
   - nama_guru
   - kelas_diajar
   - jam_mulai, jam_selesai
   - tanggal
   - created_at
   ```

4. **`peminjaman`** - Data peminjaman barang
   ```sql
   - id (PRIMARY KEY)
   - nama (peminjam)
   - barang_id (FOREIGN KEY)
   - jumlah
   - status (dipinjam/kembali)
   - waktu_pinjam, waktu_kembali
   - created_at
   ```

---

### 4️⃣ **PUBLIC FOLDER** (Frontend)

#### `public/index.html` (Main Application)
**Fungsi:**
- Halaman utama aplikasi setelah login
- Single Page Application (SPA) structure
- 5 Section utama: Dashboard, Kunjungan, Peminjaman, Barang, Laporan

**Struktur HTML:**
```html
<header>
  <!-- Logo, Title, User Info, Logout Button -->
</header>

<nav>
  <!-- Navigation Buttons (Role-based visibility) -->
</nav>

<main>
  <!-- Section Dashboard -->
  <section id="dashboard" class="page active">
    <!-- Stats Cards & Charts -->
  </section>
  
  <!-- Section Kunjungan -->
  <section id="kunjungan" class="page">
    <!-- Form & Table Kunjungan -->
  </section>
  
  <!-- Section Peminjaman -->
  <section id="peminjaman" class="page">
    <!-- Form & Table Peminjaman -->
  </section>
  
  <!-- Section Barang (Admin Only) -->
  <section id="barang" class="page">
    <!-- Form & Table Barang -->
  </section>
  
  <!-- Section Laporan (Admin Only) -->
  <section id="laporan" class="page">
    <!-- Export & Print Reports -->
  </section>
</main>

<script src="/assets/js/app.js"></script>
```

---

#### `public/login.html` (Login Page)
**Fungsi:**
- Halaman autentikasi pengguna
- Form login dengan username & password
- Redirect ke index.html setelah login sukses

**Fitur:**
- Input validation
- Error handling
- Default account info display
- Responsive design

**JavaScript Login:**
```javascript
async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // POST ke /login endpoint
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Simpan token & user data di localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect ke halaman utama
    window.location.href = 'index.html';
  } else {
    alert(data.error);
  }
}
```

---

#### `public/manifest.json` (PWA Manifest)
**Fungsi:**
- Konfigurasi Progressive Web App (PWA)
- Memungkinkan install aplikasi di mobile
- Define app name, icons, theme color

**Fitur PWA:**
- Standalone mode (seperti native app)
- Custom splash screen
- Offline capability (dengan service worker)

---

#### `public/service-worker.js` (PWA Service Worker)
**Fungsi:**
- Cache static assets untuk offline access
- Background sync
- Push notifications (future feature)

---

### 5️⃣ **PUBLIC/ASSETS FOLDER**

#### `public/assets/css/main.css` (Stylesheet)
**Fungsi:**
- Styling seluruh aplikasi
- Responsive design (Mobile, Tablet, Desktop)
- Animations & transitions

**Komponen Styling:**

1. **Reset & Base Styles**
   ```css
   * { margin: 0; padding: 0; box-sizing: border-box; }
   body { font-family: 'Segoe UI'; background: #f5f7fa; }
   ```

2. **Header Styling**
   ```css
   header {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     /* Gradient purple-blue */
   }
   ```

3. **Navigation Styling**
   ```css
   nav button {
     background: #667eea;
     transition: all 0.3s;
   }
   nav button:hover {
     transform: translateY(-2px); /* Hover effect */
   }
   ```

4. **Card & Table Styling**
   - Stats cards dengan shadow
   - Responsive tables
   - Hover effects

5. **Form Styling**
   - Input fields dengan focus states
   - Button animations
   - Validation styles

6. **Responsive Media Queries**
   ```css
   @media (max-width: 768px) {
     /* Mobile styles */
   }
   @media (max-width: 480px) {
     /* Small mobile styles */
   }
   ```

---

#### `public/assets/js/app.js` (Main JavaScript)
**Fungsi:**
- Client-side logic & interactivity
- API communication
- DOM manipulation
- State management

**Struktur Kode:**

1. **Global Variables**
   ```javascript
   const API_URL = 'http://localhost:3000';
   let currentUser = null;
   let allKunjungan = [];
   let allPeminjaman = [];
   let allBarang = [];
   ```

2. **Authentication Functions**
   ```javascript
   // Cek apakah user sudah login
   function checkAuth() {
     const token = localStorage.getItem('token');
     if (!token) {
       window.location.href = 'login.html';
       return false;
     }
     currentUser = JSON.parse(localStorage.getItem('user'));
     return true;
   }
   
   // Logout
   async function handleLogout() {
     await fetchAPI('/logout', { method: 'POST' });
     localStorage.clear();
     window.location.href = 'login.html';
   }
   ```

3. **Fetch Helper (API Communication)**
   ```javascript
   async function fetchAPI(endpoint, options = {}) {
     const token = localStorage.getItem('token');
     
     const response = await fetch(API_URL + endpoint, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': token
       }
     });
     
     if (response.status === 401) {
       // Token expired, redirect to login
       window.location.href = 'login.html';
     }
     
     return response.json();
   }
   ```

4. **Utility Functions**
   ```javascript
   // Format tanggal
   const formatDate = (iso) => {
     return new Date(iso).toLocaleDateString('id-ID');
   };
   
   // Notifikasi toast
   function showNotification(message, type = 'info') {
     // Create & show toast notification
   }
   
   // Loading overlay
   function showLoading(show = true) {
     document.getElementById('loadingOverlay').style.display = 
       show ? 'flex' : 'none';
   }
   ```

5. **Page Navigation**
   ```javascript
   function showPage(id) {
     // Hide all pages
     document.querySelectorAll(".page").forEach(p => 
       p.classList.remove("active")
     );
     
     // Show selected page
     document.getElementById(id).classList.add("active");
     
     // Load data for that page
     if (id === 'dashboard') loadDashboard();
     if (id === 'kunjungan') loadKunjungan();
     // ... etc
   }
   ```

6. **Dashboard Functions**
   ```javascript
   async function loadDashboard() {
     if (currentUser.role === 'admin') {
       // Admin: Show statistics
       const stats = await fetchAPI('/stats');
       displayAdminDashboard(stats);
     } else {
       // User: Show announcements
       displayUserDashboard();
     }
   }
   ```

7. **CRUD Functions untuk Kunjungan**
   ```javascript
   // Load data kunjungan
   async function loadKunjungan() {
     const data = await fetchAPI('/kunjungan');
     allKunjungan = data;
     displayKunjungan(data);
   }
   
   // Tambah kunjungan
   async function handleAddKunjungan(event) {
     event.preventDefault();
     const formData = {
       nama_guru: document.getElementById('namaGuru').value,
       kelas_diajar: document.getElementById('kelasDiajar').value,
       // ... etc
     };
     
     await fetchAPI('/kunjungan', {
       method: 'POST',
       body: JSON.stringify(formData)
     });
     
     showNotification('Kunjungan berhasil ditambahkan', 'success');
     loadKunjungan(); // Reload data
   }
   
   // Edit kunjungan
   async function handleUpdateKunjungan(id) {
     // Similar to add, but with PUT method
   }
   
   // Delete kunjungan (Admin only)
   async function handleDeleteKunjungan(id) {
     if (!confirm('Yakin hapus data?')) return;
     
     await fetchAPI(`/kunjungan/${id}`, { method: 'DELETE' });
     showNotification('Data berhasil dihapus', 'success');
     loadKunjungan();
   }
   ```

8. **CRUD Functions untuk Peminjaman**
   ```javascript
   // Load peminjaman
   async function loadPeminjaman() {
     const data = await fetchAPI('/peminjaman');
     allPeminjaman = data;
     displayPeminjaman(data);
   }
   
   // Tambah peminjaman (dengan validasi stok)
   async function handleAddPeminjaman(event) {
     event.preventDefault();
     
     const barangId = document.getElementById('barangId').value;
     const jumlah = parseInt(document.getElementById('jumlah').value);
     
     // Cek stok tersedia
     const barang = allBarang.find(b => b.id == barangId);
     if (barang.stok < jumlah) {
       showNotification('Stok tidak cukup!', 'error');
       return;
     }
     
     await fetchAPI('/peminjaman', {
       method: 'POST',
       body: JSON.stringify({ barangId, jumlah, nama })
     });
     
     loadPeminjaman();
     loadBarang(); // Update stok
   }
   
   // Tandai sudah dikembalikan
   async function handleReturnPeminjaman(id) {
     await fetchAPI(`/peminjaman/${id}/return`, { method: 'PUT' });
     showNotification('Barang berhasil dikembalikan', 'success');
     loadPeminjaman();
     loadBarang(); // Update stok
   }
   ```

9. **CRUD Functions untuk Barang (Admin Only)**
   ```javascript
   // Load barang
   async function loadBarang() {
     const data = await fetchAPI('/barang');
     allBarang = data;
     displayBarang(data);
   }
   
   // Tambah barang
   async function handleAddBarang(event) {
     event.preventDefault();
     
     const formData = {
       nama: document.getElementById('namaBarang').value,
       kode: document.getElementById('kodeBarang').value,
       stok: parseInt(document.getElementById('stokBarang').value)
     };
     
     await fetchAPI('/barang', {
       method: 'POST',
       body: JSON.stringify(formData)
     });
     
     showNotification('Barang berhasil ditambahkan', 'success');
     loadBarang();
   }
   
   // Edit & Delete similar pattern
   ```

10. **Search & Filter Functions**
    ```javascript
    function searchKunjungan() {
      const query = document.getElementById('searchKunjungan').value.toLowerCase();
      
      const filtered = allKunjungan.filter(k => 
        k.nama_guru.toLowerCase().includes(query) ||
        k.kelas_diajar.toLowerCase().includes(query)
      );
      
      displayKunjungan(filtered);
    }
    
    function filterPeminjaman(status) {
      const filtered = status === 'all' 
        ? allPeminjaman 
        : allPeminjaman.filter(p => p.status === status);
      
      displayPeminjaman(filtered);
    }
    ```

11. **Export Functions**
    ```javascript
    function exportToCSV(data, filename) {
      // Convert data to CSV format
      const csv = convertToCSV(data);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    }
    
    function printLaporan() {
      window.print(); // Browser print dialog
    }
    ```

12. **Initialization**
    ```javascript
    // Run when page loads
    window.addEventListener('DOMContentLoaded', () => {
      if (!checkAuth()) return;
      
      loadDashboard();
      
      // Setup event listeners
      setupEventListeners();
    });
    ```

---

### 6️⃣ **DOCS FOLDER** (Dokumentasi)

#### `docs/API_DOCUMENTATION.md`
**Fungsi:**
- Dokumentasi lengkap semua API endpoints
- Request/response examples
- Error codes

#### `docs/FOLDER_STRUCTURE.md`
**Fungsi:**
- Penjelasan struktur folder proyek
- Konvensi penamaan file

#### `docs/QUICK_START.md`
**Fungsi:**
- Panduan cepat instalasi & setup
- Troubleshooting common issues

---

### 7️⃣ **SCRIPTS FOLDER**

#### `scripts/backup.sh` & `scripts/backup.bat`
**Fungsi:**
- Automated database backup
- Cross-platform (Linux/Mac & Windows)

**Contoh backup.sh:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp data/lab.db "data/backups/lab_$DATE.db"
echo "Backup created: lab_$DATE.db"
```

---

## 🔄 ALUR KERJA APLIKASI

### 1. **User Login Flow**
```
User → login.html → Input credentials
  ↓
POST /login → server.js
  ↓
Validate credentials → Hash password → Check database
  ↓
Generate token → Save to database
  ↓
Return token + user data
  ↓
Save to localStorage → Redirect to index.html
```

### 2. **Authentication Flow**
```
Every API Request:
  ↓
Client sends token in Authorization header
  ↓
Server: authenticate() middleware
  ↓
Check token in database
  ↓
Valid? → Continue to endpoint
Invalid? → Return 401 Unauthorized
```

### 3. **CRUD Operation Flow (Example: Add Kunjungan)**
```
User fills form → Click Submit
  ↓
handleAddKunjungan() → Validate input
  ↓
fetchAPI('/kunjungan', POST) → Send data
  ↓
Server: authenticate() → Check token
  ↓
Server: INSERT INTO kunjungan
  ↓
Return success response
  ↓
Client: showNotification() → loadKunjungan()
  ↓
Display updated data in table
```

### 4. **Role-Based Access Control**
```
User logs in → Check role
  ↓
role === 'admin'?
  ├─ YES → Show all menu (Dashboard, Kunjungan, Peminjaman, Barang, Laporan)
  └─ NO  → Hide Barang & Laporan menu
  
API Request:
  ↓
requireAdmin() middleware
  ↓
req.user.role === 'admin'?
  ├─ YES → Allow access
  └─ NO  → Return 403 Forbidden
```

---

## 🎨 FITUR-FITUR UTAMA

### 1. **Dashboard Dinamis**
- **Admin Dashboard:**
  - Total kunjungan & peminjaman (cards)
  - Peminjaman aktif real-time
  - Stok barang rendah alert
  - Chart top 5 barang terpopuler
  
- **User Dashboard:**
  - Pengumuman & informasi
  - Tips penggunaan sistem

### 2. **Manajemen Kunjungan**
- Form input 5 field (Nama Guru, Kelas, Jam Mulai/Selesai, Tanggal)
- Search & filter
- Edit (User & Admin)
- Delete (Admin only)
- Export to CSV

### 3. **Manajemen Peminjaman**
- Form dengan dropdown barang
- Validasi stok otomatis
- Filter by status (Dipinjam/Kembali)
- Tandai sudah dikembalikan
- Auto-update stok barang
- Export to CSV

### 4. **Manajemen Barang (Admin Only)**
- CRUD lengkap
- Kode barang unique
- Highlight stok rendah (< 5)
- Search by nama/kode
- Export to CSV

### 5. **Laporan (Admin Only)**
- Export all data to CSV
- Print preview
- Statistics summary

---

## 🔒 KEAMANAN

### 1. **Password Security**
- SHA-256 hashing
- Never store plain text passwords

### 2. **Token-Based Authentication**
- Random 32-byte token
- Stored in database
- Sent in Authorization header
- Validated on every request

### 3. **Role-Based Access Control (RBAC)**
- User role: Limited access
- Admin role: Full access
- Middleware enforcement

### 4. **Input Validation**
- Client-side: HTML5 validation
- Server-side: Data type checking
- SQL injection prevention (parameterized queries)

---

## 📱 RESPONSIVE DESIGN

### Breakpoints:
- **Desktop**: > 768px (Full layout)
- **Tablet**: 481px - 768px (Adjusted grid)
- **Mobile**: ≤ 480px (Stacked layout)

### Mobile Optimizations:
- Touch-friendly buttons (44x44px minimum)
- Simplified navigation
- Responsive tables (horizontal scroll)
- Optimized forms

---

## 🚀 CARA MENJALANKAN

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start Server**
```bash
npm start
# atau untuk development:
npm run dev
```

### 3. **Open Browser**
```
http://localhost:3000/login.html
```

### 4. **Default Accounts**
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

---

## 📊 DATABASE SCHEMA DIAGRAM

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ username    │
│ password    │
│ role        │
│ token       │
│ created_at  │
└─────────────┘

┌─────────────┐
│   barang    │
├─────────────┤
│ id (PK)     │
│ nama        │
│ kode        │
│ stok        │
│ created_at  │
│ updated_at  │
└─────────────┘
       ↑
       │ (FK)
       │
┌─────────────┐
│ peminjaman  │
├─────────────┤
│ id (PK)     │
│ nama        │
│ barang_id   │───┘
│ jumlah      │
│ status      │
│ waktu_pinjam│
│ waktu_kembali│
│ created_at  │
└─────────────┘

┌─────────────┐
│ kunjungan   │
├─────────────┤
│ id (PK)     │
│ nama_guru   │
│ kelas_diajar│
│ jam_mulai   │
│ jam_selesai │
│ tanggal     │
│ created_at  │
└─────────────┘
```

---

## 🎯 KELEBIHAN PROYEK INI

### 1. **Full Stack Complete**
✅ Backend API (Node.js + Express)
✅ Frontend UI (HTML + CSS + JS)
✅ Database (SQLite)
✅ Authentication & Authorization

### 2. **Modern Architecture**
✅ RESTful API design
✅ MVC pattern
✅ Separation of concerns
✅ Modular code structure

### 3. **User Experience**
✅ Responsive design
✅ Smooth animations
✅ Toast notifications
✅ Loading indicators
✅ Role-based UI

### 4. **Security**
✅ Password hashing
✅ Token authentication
✅ Role-based access control
✅ Input validation

### 5. **Maintainability**
✅ Clean code structure
✅ Comprehensive documentation
✅ Consistent naming conventions
✅ Comments & explanations

### 6. **Scalability**
✅ Modular architecture
✅ Easy to add new features
✅ Database-driven
✅ API-first approach

---

## 🔮 FUTURE ENHANCEMENTS

### Potential Features:
1. **Advanced Reporting**
   - PDF export
   - Charts & graphs
   - Date range filters

2. **Notifications**
   - Email notifications
   - Push notifications (PWA)
   - Reminder for overdue returns

3. **Advanced Search**
   - Multi-field search
   - Advanced filters
   - Sorting options

4. **User Management**
   - Register new users
   - Change password
   - User profiles

5. **Audit Log**
   - Track all changes
   - Who did what when
   - Activity history

6. **Barcode Integration**
   - Scan barcode for barang
   - Quick checkout
   - Inventory tracking

---

## 📝 KESIMPULAN

**Lab Management System** adalah aplikasi full-stack yang lengkap dan profesional dengan:

✅ **Backend yang robust** (Node.js + Express + SQLite)
✅ **Frontend yang modern** (Responsive, Interactive, User-friendly)
✅ **Security yang baik** (Authentication, Authorization, Hashing)
✅ **Code yang clean** (Modular, Documented, Maintainable)
✅ **Fitur yang lengkap** (CRUD, Search, Filter, Export, Print)

Proyek ini mendemonstrasikan pemahaman yang baik tentang:
- Web development fundamentals
- Database design
- API development
- Security best practices
- User experience design
- Code organization

---

## 💡 TIPS PRESENTASI

### 1. **Demo Flow:**
1. Tunjukkan login page → Login sebagai user
2. Explore user dashboard → Tambah kunjungan
3. Logout → Login sebagai admin
4. Tunjukkan admin features (Barang, Laporan)
5. Demo CRUD operations
6. Show responsive design (resize browser)

### 2. **Highlight Points:**
- Full stack architecture
- Security features
- Role-based access
- Responsive design
- Clean code structure

### 3. **Technical Discussion:**
- Explain authentication flow
- Show database schema
- Discuss API endpoints
- Explain frontend-backend communication

### 4. **Code Walkthrough:**
- Show `server.js` structure
- Explain middleware concept
- Show `app.js` functions
- Discuss CSS organization

---

**Good luck dengan presentasi Anda! 🚀**

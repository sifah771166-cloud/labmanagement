require('dotenv').config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Database connection
const dbPath = process.env.DB_PATH || './data/lab.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✓ Connected to SQLite database');
});

// Helper function untuk hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Middleware untuk autentikasi
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  db.get("SELECT * FROM users WHERE token=?", [token], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Middleware untuk super admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Forbidden: Admin only" });
  }
  next();
}

// DATABASE
db.serialize(() => {
  // Tabel users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    token TEXT,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS barang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    stok INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS kunjungan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_guru TEXT NOT NULL,
    kelas_diajar TEXT NOT NULL,
    jam_mulai TEXT NOT NULL,
    jam_selesai TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS peminjaman (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    barang_id INTEGER NOT NULL,
    jumlah INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'dipinjam',
    waktu_pinjam TEXT NOT NULL,
    waktu_kembali TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY(barang_id) REFERENCES barang(id)
  )`);

  // Seed default users
  const adminPassword = hashPassword('admin123');
  const userPassword = hashPassword('user123');
  
  db.run(
    "INSERT OR IGNORE INTO users (username, password, role, created_at) VALUES (?, ?, ?, ?)",
    ['admin', adminPassword, 'admin', new Date().toISOString()]
  );
  
  db.run(
    "INSERT OR IGNORE INTO users (username, password, role, created_at) VALUES (?, ?, ?, ?)",
    ['user', userPassword, 'user', new Date().toISOString()]
  );

  // Seed data untuk barang
  const barangItems = [
    { nama: "Camera", kode: "CAM001", stok: 5 },
    { nama: "Laptop", kode: "LAP001", stok: 8 },
    { nama: "Buku", kode: "BUK001", stok: 20 },
    { nama: "Penggaris", kode: "PEN001", stok: 15 },
    { nama: "Microscope", kode: "MIC001", stok: 3 },
    { nama: "Projector", kode: "PROJ001", stok: 2 },
    { nama: "Whiteboard", kode: "WB001", stok: 4 },
    { nama: "Pendrive", kode: "USB001", stok: 10 },
    { nama: "Mouse", kode: "MOU001", stok: 12 },
    { nama: "Keyboard", kode: "KEY001", stok: 10 }
  ];

  const now = new Date().toISOString();
  barangItems.forEach(item => {
    db.run(
      "INSERT OR IGNORE INTO barang (nama, kode, stok, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [item.nama, item.kode, item.stok, now, now]
    );
  });
});

// ============ AUTH ENDPOINTS ============
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password harus diisi" });
  }
  
  const hashedPassword = hashPassword(password);
  
  db.get(
    "SELECT id, username, role FROM users WHERE username=? AND password=?",
    [username, hashedPassword],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Username atau password salah" });
      }
      
      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      
      db.run("UPDATE users SET token=? WHERE id=?", [token, user.id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Database error" });
        }
        
        res.json({
          success: true,
          token: token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      });
    }
  );
});

app.post("/logout", authenticate, (req, res) => {
  db.run("UPDATE users SET token=NULL WHERE id=?", [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});

app.get("/me", authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});

// Health check endpoint (no auth required)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


// ============ BARANG ENDPOINTS ============
app.get("/barang", authenticate, (req, res) => {
  const search = req.query.search || '';
  let query = "SELECT * FROM barang";
  let params = [];
  
  if (search) {
    query += " WHERE nama LIKE ? OR kode LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }
  
  query += " ORDER BY nama ASC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(rows || []);
  });
});

app.post("/barang", authenticate, requireAdmin, (req, res) => {
  const { nama, kode, stok } = req.body;
  if (!nama || !kode || stok === undefined || stok === null) {
    return res.status(400).json({ error: "Field nama, kode, dan stok harus diisi" });
  }
  if (stok < 0) {
    return res.status(400).json({ error: "Stok tidak boleh negatif" });
  }

  const now = new Date().toISOString();
  db.run(
    "INSERT INTO barang (nama, kode, stok, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [nama, kode, parseInt(stok), now, now],
    function(err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Kode barang sudah ada" });
        }
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

app.put("/barang/:id", authenticate, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, kode, stok } = req.body;
  
  if (!id || !nama || !kode || stok === undefined || stok === null) {
    return res.status(400).json({ error: "Field tidak lengkap" });
  }
  
  if (stok < 0) {
    return res.status(400).json({ error: "Stok tidak boleh negatif" });
  }
  
  const now = new Date().toISOString();
  db.run(
    "UPDATE barang SET nama=?, kode=?, stok=?, updated_at=? WHERE id=?",
    [nama, kode, parseInt(stok), now, id],
    function(err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Kode barang sudah ada" });
        }
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Barang tidak ditemukan" });
      }
      res.json({ success: true });
    }
  );
});

app.delete("/barang/:id", authenticate, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID tidak valid" });
  }
  
  // Check if barang is being borrowed
  db.get(
    "SELECT COUNT(*) as count FROM peminjaman WHERE barang_id=? AND status='dipinjam'",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (row.count > 0) {
        return res.status(400).json({ error: "Barang sedang dipinjam, tidak bisa dihapus" });
      }
      
      db.run("DELETE FROM barang WHERE id=?", [id], function(deleteErr) {
        if (deleteErr) {
          return res.status(500).json({ error: "Database error", details: deleteErr.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: "Barang tidak ditemukan" });
        }
        res.json({ success: true });
      });
    }
  );
});


// ============ KUNJUNGAN ENDPOINTS ============
app.get("/kunjungan", authenticate, (req, res) => {
  const search = req.query.search || '';
  let query = "SELECT * FROM kunjungan";
  let params = [];
  
  if (search) {
    query += " WHERE nama_guru LIKE ? OR kelas_diajar LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }
  
  query += " ORDER BY tanggal DESC, jam_mulai DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(rows || []);
  });
});

app.post("/kunjungan", authenticate, (req, res) => {
  const { nama_guru, kelas_diajar, jam_mulai, jam_selesai, tanggal } = req.body;
  if (!nama_guru || !kelas_diajar || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }

  const tanggalKunjung = tanggal ? tanggal : new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  db.run(
    "INSERT INTO kunjungan (nama_guru, kelas_diajar, jam_mulai, jam_selesai, tanggal, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [nama_guru, kelas_diajar, jam_mulai, jam_selesai, tanggalKunjung, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

app.put("/kunjungan/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const { nama_guru, kelas_diajar, jam_mulai, jam_selesai, tanggal } = req.body;
  
  if (!id || !nama_guru || !kelas_diajar || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ error: "Field tidak lengkap" });
  }
  
  const tanggalKunjung = tanggal ? tanggal : new Date().toISOString().split('T')[0];
  
  db.run(
    "UPDATE kunjungan SET nama_guru=?, kelas_diajar=?, jam_mulai=?, jam_selesai=?, tanggal=? WHERE id=?",
    [nama_guru, kelas_diajar, jam_mulai, jam_selesai, tanggalKunjung, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Kunjungan tidak ditemukan" });
      }
      res.json({ success: true });
    }
  );
});


// ============ PEMINJAMAN ENDPOINTS ============
app.get("/peminjaman", authenticate, (req, res) => {
  const search = req.query.search || '';
  const status = req.query.status || '';
  
  let query = `
    SELECT p.*, b.nama as barang_nama, b.kode as barang_kode
    FROM peminjaman p
    JOIN barang b ON p.barang_id = b.id
    WHERE 1=1
  `;
  let params = [];
  
  if (search) {
    query += " AND (p.nama LIKE ? OR b.nama LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (status) {
    query += " AND p.status = ?";
    params.push(status);
  }
  
  query += " ORDER BY p.waktu_pinjam DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(rows || []);
  });
});

app.post("/peminjaman", authenticate, (req, res) => {
  const { nama, barang_id, jumlah, tanggal } = req.body;
  
  if (!nama || !barang_id || jumlah === undefined || jumlah === null) {
    return res.status(400).json({ error: "Field tidak lengkap" });
  }
  
  const jumlahInt = parseInt(jumlah);
  if (jumlahInt <= 0) {
    return res.status(400).json({ error: "Jumlah harus lebih dari 0" });
  }
  
  const waktu_pinjam = tanggal ? new Date(tanggal).toISOString() : new Date().toISOString();
  const now = new Date().toISOString();

  db.get("SELECT stok, nama FROM barang WHERE id=?", [barang_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    }
    if (row.stok < jumlahInt) {
      return res.status(400).json({ 
        error: `Stok ${row.nama} tidak cukup. Tersedia: ${row.stok}, Diminta: ${jumlahInt}` 
      });
    }

    db.run("UPDATE barang SET stok = stok - ?, updated_at=? WHERE id=?", [jumlahInt, now, barang_id], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Database error", details: updateErr.message });
      }
      
      db.run(`
        INSERT INTO peminjaman (nama, barang_id, jumlah, status, waktu_pinjam, created_at)
        VALUES (?, ?, ?, 'dipinjam', ?, ?)
      `, [nama, barang_id, jumlahInt, waktu_pinjam, now], function(insertErr) {
        if (insertErr) {
          return res.status(500).json({ error: "Database error", details: insertErr.message });
        }
        res.status(201).json({ success: true, id: this.lastID });
      });
    });
  });
});


app.put("/peminjaman/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID tidak valid" });
  }
  
  const { nama, jumlah } = req.body;
  
  // If updating peminjaman details (for user edit)
  if (nama !== undefined || jumlah !== undefined) {
    db.get("SELECT * FROM peminjaman WHERE id=?", [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error", details: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Peminjaman tidak ditemukan" });
      }
      
      const newNama = nama !== undefined ? nama : row.nama;
      const newJumlah = jumlah !== undefined ? parseInt(jumlah) : row.jumlah;
      
      // If jumlah changed, need to adjust stock
      if (newJumlah !== row.jumlah && row.status === 'dipinjam') {
        const diff = newJumlah - row.jumlah;
        const now = new Date().toISOString();
        
        db.get("SELECT stok FROM barang WHERE id=?", [row.barang_id], (err2, barang) => {
          if (err2) {
            return res.status(500).json({ error: "Database error" });
          }
          if (barang.stok < diff) {
            return res.status(400).json({ error: "Stok tidak cukup untuk perubahan jumlah" });
          }
          
          db.run("UPDATE barang SET stok = stok - ?, updated_at=? WHERE id=?", [diff, now, row.barang_id], (err3) => {
            if (err3) {
              return res.status(500).json({ error: "Database error" });
            }
            
            db.run("UPDATE peminjaman SET nama=?, jumlah=? WHERE id=?", [newNama, newJumlah, id], (err4) => {
              if (err4) {
                return res.status(500).json({ error: "Database error" });
              }
              res.json({ success: true });
            });
          });
        });
      } else {
        db.run("UPDATE peminjaman SET nama=? WHERE id=?", [newNama, id], (err5) => {
          if (err5) {
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ success: true });
        });
      }
    });
    return;
  }
  
  // Original return functionality
  const now = new Date().toISOString();

  db.get("SELECT barang_id, jumlah, status FROM peminjaman WHERE id=?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Peminjaman tidak ditemukan" });
    }
    if (row.status === 'kembali') {
      return res.status(400).json({ error: "Item sudah dikembalikan" });
    }

    db.run("UPDATE barang SET stok = stok + ?, updated_at=? WHERE id=?", [row.jumlah, now, row.barang_id], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Database error", details: updateErr.message });
      }
      
      db.run(`
        UPDATE peminjaman
        SET status='kembali', waktu_kembali=?
        WHERE id=?
      `, [now, id], (updateErr2) => {
        if (updateErr2) {
          return res.status(500).json({ error: "Database error", details: updateErr2.message });
        }
        res.json({ success: true });
      });
    });
  });
});

// DELETE KUNJUNGAN (Admin only)
app.delete("/kunjungan/:id", authenticate, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID tidak valid" });
  }
  
  db.run("DELETE FROM kunjungan WHERE id=?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Kunjungan tidak ditemukan" });
    }
    res.json({ success: true });
  });
});

// DELETE PEMINJAMAN (Admin only)
app.delete("/peminjaman/:id", authenticate, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "ID tidak valid" });
  }
  
  db.get("SELECT barang_id, jumlah, status FROM peminjaman WHERE id=?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Peminjaman tidak ditemukan" });
    }

    const now = new Date().toISOString();
    if (row.status === 'dipinjam') {
      db.run("UPDATE barang SET stok = stok + ?, updated_at=? WHERE id=?", [row.jumlah, now, row.barang_id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Database error", details: updateErr.message });
        }
        
        db.run("DELETE FROM peminjaman WHERE id=?", [id], (deleteErr) => {
          if (deleteErr) {
            return res.status(500).json({ error: "Database error", details: deleteErr.message });
          }
          res.json({ success: true });
        });
      });
    } else {
      db.run("DELETE FROM peminjaman WHERE id=?", [id], (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ error: "Database error", details: deleteErr.message });
        }
        res.json({ success: true });
      });
    }
  });
});

// ============ DASHBOARD STATS ============
app.get("/stats", authenticate, (req, res) => {
  const stats = {};
  
  // Total kunjungan
  db.get("SELECT COUNT(*) as total FROM kunjungan", [], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    stats.totalKunjungan = row.total;
    
    // Total peminjaman
    db.get("SELECT COUNT(*) as total FROM peminjaman", [], (err2, row2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      stats.totalPeminjaman = row2.total;
      
      // Peminjaman aktif
      db.get("SELECT COUNT(*) as total FROM peminjaman WHERE status='dipinjam'", [], (err3, row3) => {
        if (err3) return res.status(500).json({ error: "Database error" });
        stats.peminjamanAktif = row3.total;
        
        // Total barang
        db.get("SELECT COUNT(*) as total FROM barang", [], (err4, row4) => {
          if (err4) return res.status(500).json({ error: "Database error" });
          stats.totalBarang = row4.total;
          
          // Barang stok rendah (< 5)
          db.get("SELECT COUNT(*) as total FROM barang WHERE stok < 5", [], (err5, row5) => {
            if (err5) return res.status(500).json({ error: "Database error" });
            stats.barangStokRendah = row5.total;
            
            // Kunjungan hari ini
            const today = new Date().toISOString().split('T')[0];
            db.get(
              "SELECT COUNT(*) as total FROM kunjungan WHERE DATE(tanggal) = DATE(?)",
              [today],
              (err6, row6) => {
                if (err6) return res.status(500).json({ error: "Database error" });
                stats.kunjunganHariIni = row6.total;
                
                // Top 5 barang paling sering dipinjam
                db.all(`
                  SELECT b.nama, COUNT(*) as total
                  FROM peminjaman p
                  JOIN barang b ON p.barang_id = b.id
                  GROUP BY b.id
                  ORDER BY total DESC
                  LIMIT 5
                `, [], (err7, rows7) => {
                  if (err7) return res.status(500).json({ error: "Database error" });
                  stats.topBarang = rows7;
                  
                  res.json(stats);
                });
              }
            );
          });
        });
      });
    });
  });
});

// ============ ERROR HANDLING ============
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('✓ Database connection closed');
    }
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log('Lab Management System');
  console.log('=================================');
  console.log(`✓ Server running at http://${HOST}:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: ${dbPath}`);
  console.log('=================================');
  console.log('Press Ctrl+C to stop');
});
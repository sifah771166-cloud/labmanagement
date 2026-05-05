# 🚀 Quick Start Guide

## Langkah Cepat Menjalankan Aplikasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server
```bash
npm start
```

### 3. Buka Browser
```
http://localhost:3000
```

### 4. Login
**Admin:**
- Username: `admin`
- Password: `admin123`

**User:**
- Username: `user`
- Password: `user123`

## Selesai! 🎉

Aplikasi sudah siap digunakan. Database akan otomatis dibuat dengan data sample.

---

## Untuk Development (dengan auto-reload)
```bash
npm run dev
```

## Untuk Production
1. Edit file `.env`:
   ```env
   NODE_ENV=production
   HOST=0.0.0.0
   ```

2. Jalankan dengan PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name lab-management
   ```

## Troubleshooting

### Port 3000 sudah digunakan?
Edit `.env` dan ganti PORT:
```env
PORT=3001
```

### Error "Cannot find module"?
```bash
rm -rf node_modules
npm install
```

### Ingin reset database?
```bash
# Hapus database
rm data/lab.db

# Restart server (akan create database baru)
npm start
```

---

**Butuh bantuan lebih lanjut?**
- Lihat [README.md](../README.md) untuk dokumentasi lengkap
- Lihat [DEPLOYMENT_LARAGON.md](DEPLOYMENT_LARAGON.md) untuk deployment ke Laragon

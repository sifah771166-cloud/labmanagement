# 🚀 Panduan Deployment ke Laragon

## Persiapan di Laptop dengan Laragon

### 1. Install Dependencies
```bash
# Buka terminal di folder proyek
cd /path/to/labmagementdkv
npm install
```

### 2. Konfigurasi Environment
```bash
# Copy file .env.example menjadi .env
copy .env.example .env

# Edit .env untuk production
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DB_PATH=./data/lab.db
JWT_SECRET=ganti-dengan-secret-key-yang-aman
```

### 3. Jalankan Server
```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

## Akses dari Jaringan Lokal

### Opsi 1: Menggunakan IP Lokal
1. Cari IP address laptop Anda:
   ```bash
   # Windows
   ipconfig
   
   # Cari IPv4 Address, contoh: 192.168.1.100
   ```

2. Akses dari device lain di jaringan yang sama:
   ```
   http://192.168.1.100:3000
   ```

### Opsi 2: Menggunakan Laragon Virtual Host
1. Buka Laragon
2. Klik kanan pada Laragon tray icon → Apache → httpd.conf
3. Tambahkan konfigurasi reverse proxy:
   ```apache
   <VirtualHost *:80>
       ServerName labmanagement.test
       ProxyPreserveHost On
       ProxyPass / http://localhost:3000/
       ProxyPassReverse / http://localhost:3000/
   </VirtualHost>
   ```

4. Edit file hosts (C:\Windows\System32\drivers\etc\hosts):
   ```
   127.0.0.1 labmanagement.test
   ```

5. Restart Apache di Laragon

6. Akses melalui: `http://labmanagement.test`

## Akses dari Internet (Online)

### Opsi 1: Menggunakan ngrok (Gratis, Temporary)
1. Download ngrok dari https://ngrok.com/
2. Jalankan:
   ```bash
   ngrok http 3000
   ```
3. Akan mendapat URL publik seperti: `https://abc123.ngrok.io`
4. Share URL tersebut untuk akses online

### Opsi 2: Port Forwarding (Permanent)
1. Login ke router Anda
2. Buka menu Port Forwarding
3. Tambahkan rule:
   - External Port: 80 atau 8080
   - Internal Port: 3000
   - Internal IP: IP laptop Anda (192.168.1.100)
4. Cari IP publik Anda di https://whatismyip.com
5. Akses melalui: `http://your-public-ip:8080`

### Opsi 3: Deploy ke Cloud (Recommended untuk Production)
- **Heroku**: Gratis untuk hobby projects
- **Railway**: Gratis dengan limit
- **Vercel**: Gratis untuk personal projects
- **DigitalOcean**: $5/bulan untuk VPS

## Keamanan untuk Production

### 1. Ganti Password Default
Edit `server.js` dan ganti password default:
```javascript
const adminPassword = hashPassword('password-admin-yang-kuat');
const userPassword = hashPassword('password-user-yang-kuat');
```

### 2. Gunakan HTTPS
- Untuk production, selalu gunakan HTTPS
- Gunakan Let's Encrypt untuk SSL certificate gratis

### 3. Firewall
- Pastikan hanya port yang diperlukan yang terbuka
- Gunakan firewall untuk membatasi akses

### 4. Backup Database
```bash
# Backup database secara berkala
copy data\lab.db data\lab_backup_YYYYMMDD.db
```

## Troubleshooting

### Server tidak bisa diakses dari device lain
1. Pastikan firewall Windows mengizinkan port 3000
2. Cek apakah server berjalan: `netstat -an | findstr 3000`
3. Pastikan HOST di .env adalah `0.0.0.0` bukan `localhost`

### Error "Cannot find module"
```bash
# Install ulang dependencies
rm -rf node_modules
npm install
```

### Database error
```bash
# Pastikan folder data ada
mkdir data

# Restart server untuk recreate database
npm start
```

## Monitoring

### Cek Status Server
```bash
# Windows
tasklist | findstr node

# Lihat log
npm start
```

### Auto-restart dengan PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start dengan PM2
pm2 start server.js --name lab-management

# Auto-start on boot
pm2 startup
pm2 save

# Monitor
pm2 monit

# Logs
pm2 logs lab-management
```

## Update Aplikasi

```bash
# Pull update dari git (jika menggunakan git)
git pull

# Install dependencies baru (jika ada)
npm install

# Restart server
pm2 restart lab-management
# atau
npm start
```

## Kontak Support
Jika ada masalah, hubungi administrator sistem.

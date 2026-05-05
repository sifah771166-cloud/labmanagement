# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Server Won't Start

#### Error: "Port 3000 is already in use"
**Solution:**
```bash
# Option 1: Change port in .env
PORT=3001

# Option 2: Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### Error: "Cannot find module 'express'"
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Error: "EACCES: permission denied"
**Solution:**
```bash
# Mac/Linux: Fix permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo npm start
```

---

### 2. Database Issues

#### Error: "Database is locked"
**Solution:**
```bash
# Close all connections to database
# Restart the server
npm start
```

#### Error: "No such table: users"
**Solution:**
```bash
# Delete database and let it recreate
rm data/lab.db
npm start
```

#### Database corrupted
**Solution:**
```bash
# Restore from backup
cp backups/lab_backup_YYYYMMDD_HHMMSS.db data/lab.db

# Or reset database (will lose all data)
rm data/lab.db
npm start
```

---

### 3. Login Issues

#### Can't login with default credentials
**Solution:**
1. Check if database was created properly
2. Try resetting database:
   ```bash
   rm data/lab.db
   npm start
   ```
3. Default credentials:
   - Admin: `admin` / `admin123`
   - User: `user` / `user123`

#### "Invalid token" error
**Solution:**
```javascript
// Clear browser storage
localStorage.clear()
// Then login again
```

#### Session expires too quickly
**Solution:**
```env
# Increase session timeout in .env (in milliseconds)
SESSION_TIMEOUT=7200000  # 2 hours
```

---

### 4. Network/Access Issues

#### Can't access from other devices
**Solution:**
1. Check firewall settings
2. Make sure HOST is set to `0.0.0.0` in `.env`:
   ```env
   HOST=0.0.0.0
   ```
3. Find your IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
4. Access from other device: `http://YOUR_IP:3000`

#### CORS errors in browser console
**Solution:**
The server already has CORS enabled. If still having issues:
```javascript
// In server.js, update CORS config:
app.use(cors({
  origin: '*',  // Allow all origins (development only)
  credentials: true
}));
```

---

### 5. Frontend Issues

#### Blank page or white screen
**Solution:**
1. Check browser console for errors (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check if API_URL in `app.js` is correct:
   ```javascript
   const API_URL = 'http://localhost:3000';
   ```

#### Data not loading
**Solution:**
1. Check if server is running
2. Check browser console for errors
3. Check network tab in DevTools
4. Verify API endpoints are responding:
   ```bash
   curl http://localhost:3000/barang
   ```

#### Buttons not working
**Solution:**
1. Check browser console for JavaScript errors
2. Clear browser cache
3. Try different browser
4. Check if JavaScript is enabled

---

### 6. Performance Issues

#### Server is slow
**Solution:**
1. Check database size:
   ```bash
   ls -lh data/lab.db
   ```
2. Optimize database:
   ```bash
   sqlite3 data/lab.db "VACUUM;"
   ```
3. Check server resources:
   ```bash
   # Check memory usage
   top
   # or
   htop
   ```

#### High memory usage
**Solution:**
1. Restart server
2. Check for memory leaks in code
3. Use PM2 for better process management:
   ```bash
   npm install -g pm2
   pm2 start server.js --name lab-management
   ```

---

### 7. Deployment Issues

#### Can't access after deployment
**Solution:**
1. Check if server is running:
   ```bash
   ps aux | grep node
   ```
2. Check logs:
   ```bash
   tail -f logs/*.log
   # or with PM2
   pm2 logs lab-management
   ```
3. Check firewall rules
4. Verify environment variables

#### SSL/HTTPS issues
**Solution:**
1. Use reverse proxy (nginx/Apache)
2. Get SSL certificate from Let's Encrypt
3. Configure HTTPS in reverse proxy

---

### 8. Development Issues

#### Changes not reflecting
**Solution:**
1. For backend changes: Restart server
2. For frontend changes: Clear browser cache (Ctrl+F5)
3. Use nodemon for auto-reload:
   ```bash
   npm run dev
   ```

#### Git issues
**Solution:**
```bash
# Discard local changes
git reset --hard

# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install
```

---

## Debugging Tips

### Enable Debug Mode
```env
# In .env
NODE_ENV=development
LOG_LEVEL=debug
```

### Check Server Logs
```bash
# View logs
tail -f logs/*.log

# With PM2
pm2 logs lab-management
```

### Test API Endpoints
```bash
# Test login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test with token
curl http://localhost:3000/barang \
  -H "Authorization: YOUR_TOKEN"
```

### Browser DevTools
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage

---

## Still Having Issues?

1. Check [README.md](../README.md) for documentation
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Search existing issues on GitHub
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

---

## Emergency Recovery

### Complete Reset (Will lose all data!)
```bash
# Stop server
# Delete database
rm data/lab.db

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install

# Start fresh
npm start
```

### Restore from Backup
```bash
# List backups
ls -lh backups/

# Restore specific backup
cp backups/lab_backup_YYYYMMDD_HHMMSS.db data/lab.db

# Restart server
npm start
```

# Troubleshooting Guide

## "Failed to fetch" Error When Adding Bike

### Step 1: Check if Backend is Running

1. **Open a new terminal/command prompt**
2. **Navigate to backend folder:**
   ```bash
   cd D:\nattu\bike-rental\backend
   ```

3. **Start the backend server:**
   ```bash
   python run.py
   ```
   OR
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **You should see:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   INFO:     Application startup complete.
   ```

### Step 2: Verify Backend is Accessible

1. **Open browser and go to:**
   - http://localhost:8000/docs
   - You should see Swagger API documentation

2. **Or test the health endpoint:**
   - http://localhost:8000/api/health
   - Should return: `{"status": "healthy"}`

### Step 3: Check Frontend Configuration

1. **Verify `.env` file exists in root folder** (`D:\nattu\bike-rental\.env`)
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

2. **Restart frontend dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
   ⚠️ **Important:** Vite requires restart to load new `.env` variables

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab to see if requests are being made

### Step 5: Common Issues

**Issue: Backend not running**
- Solution: Start backend server (see Step 1)

**Issue: Wrong port**
- Check backend is on port 8000
- Check `.env` has correct URL

**Issue: CORS error**
- Backend CORS is configured for `localhost:5173`
- If using different port, update `backend/app/main.py`

**Issue: Database connection error**
- Check PostgreSQL is running
- Verify `backend/.env` has correct DATABASE_URL
- Check database exists: `bike_rental_db`

### Quick Test

1. **Backend running?** → http://localhost:8000/docs
2. **Frontend can reach backend?** → Check browser console for errors
3. **Database connected?** → Check backend terminal for errors

### Still Not Working?

1. Check both terminals (backend + frontend) for error messages
2. Verify PostgreSQL is running
3. Check firewall isn't blocking port 8000
4. Try accessing http://localhost:8000/api/bikes/ directly in browser


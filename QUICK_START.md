# Quick Start Guide - Backend Integration

## 🚀 Quick Setup (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bike_rental_db
```

### 2. Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE bike_rental_db;

-- Exit
\q
```

### 3. Run Backend

```bash
cd backend
python run.py
# OR
uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

### 4. Seed Initial Data (Optional)

```bash
cd backend
python seed_data.py
```

### 5. Frontend Setup

```bash
# In project root, create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Restart frontend
npm run dev
```

## ✅ Verify It Works

1. Open http://localhost:8000/docs - Should see Swagger UI
2. Try `GET /api/bikes/` - Should return bikes (or empty array)
3. Open http://localhost:5173/bikes - Should load bikes from API
4. Go to Admin panel - Edit a bike - Should update in database
5. Check user page - Changes should reflect immediately

## 🔄 How It Works

- **Admin edits bike** → API call to `PUT /api/bikes/{id}` → Database updated
- **User views bikes** → API call to `GET /api/bikes/` → Shows latest data
- **Real-time sync** → Both admin and user pages fetch from same API

## 📝 API Endpoints

- `GET /api/bikes/` - List all bikes
- `GET /api/bikes/{id}` - Get single bike
- `POST /api/bikes/` - Create bike
- `PUT /api/bikes/{id}` - Update bike
- `DELETE /api/bikes/{id}` - Delete bike

## 🐛 Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Test connection: `psql -U postgres -d bike_rental_db`

**CORS errors?**
- Check `allow_origins` in `backend/app/main.py`
- Ensure frontend URL matches

**API not responding?**
- Check backend is running: http://localhost:8000
- Check frontend `.env` has correct `VITE_API_URL`


# Backend Setup Guide

## Prerequisites
- Python 3.8+
- PostgreSQL installed and running
- pip (Python package manager)

## Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or use a virtual environment (recommended):

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

## Step 2: Setup PostgreSQL Database

1. **Install PostgreSQL** (if not installed)
   - Download from: https://www.postgresql.org/download/

2. **Create Database**
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres

   -- Create database
   CREATE DATABASE bike_rental_db;

   -- Exit
   \q
   ```

3. **Create .env file**
   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Update .env with your database credentials:**
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/bike_rental_db
   SECRET_KEY=your-secret-key-here-change-this
   ```

   Example:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bike_rental_db
   ```

## Step 3: Run the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Step 4: Configure Frontend

1. Create `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

2. Restart your frontend dev server:
   ```bash
   npm run dev
   ```

## Step 5: Test the Connection

1. Open http://localhost:8000/docs
2. Try the `GET /api/bikes/` endpoint
3. Check if your frontend loads bikes from the API

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Port Already in Use
- Change port: `uvicorn app.main:app --reload --port 8001`
- Update frontend `.env`: `VITE_API_URL=http://localhost:8001/api`

### CORS Errors
- Check `allow_origins` in `backend/app/main.py`
- Ensure frontend URL matches (default: http://localhost:5173)

## API Endpoints

### Bikes
- `GET /api/bikes/` - Get all bikes
- `GET /api/bikes/{id}` - Get bike by ID
- `POST /api/bikes/` - Create bike
- `PUT /api/bikes/{id}` - Update bike
- `DELETE /api/bikes/{id}` - Delete bike

### Bookings
- `GET /api/bookings/` - Get all bookings
- `POST /api/bookings/` - Create booking


# Bike Rental Backend API

FastAPI backend with PostgreSQL for the Bike Rental application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

1. Install PostgreSQL if not already installed
2. Create a database:
```sql
CREATE DATABASE bike_rental_db;
```

3. Update `.env` file with your database credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/bike_rental_db
```

### 3. Run Database Migrations (Optional - tables auto-create)

The tables will be created automatically on first run. For production, use Alembic migrations.

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 5. API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Bikes
- `GET /api/bikes/` - Get all bikes
- `GET /api/bikes/{bike_id}` - Get bike by ID
- `POST /api/bikes/` - Create new bike
- `PUT /api/bikes/{bike_id}` - Update bike
- `DELETE /api/bikes/{bike_id}` - Delete bike
- `GET /api/bikes/status/{status}` - Get bikes by status

### Bookings
- `GET /api/bookings/` - Get all bookings
- `GET /api/bookings/{booking_id}` - Get booking by ID
- `POST /api/bookings/` - Create new booking

## Environment Variables

Create a `.env` file in the backend directory:
```
DATABASE_URL=postgresql://username:password@localhost:5432/bike_rental_db
SECRET_KEY=your-secret-key-here
```


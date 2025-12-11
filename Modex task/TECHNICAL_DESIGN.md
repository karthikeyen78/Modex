# Technical Design Document: Ticket Booking System

## Current Implementation

### 1. System Architecture

#### Sequence Diagram

![Sequence Diagram](https://kroki.io/mermaid/svg/eNqNkstugzAQRff9itlEahdV91lE4mEiSwlQIN07MG2tUJti07R_X2NeCaRSWc69vnNmBoWfDYocfc7eavZxB-arWK15zismNBwU1ouiE9NFzXcXJfJd8frnztZXK0jf5Rm8GpnmUthiG_642Zi4NcRRmsETKz64eFLGaQ1GMbrvruGFlbxgGoGKqtEz0YaibWAV330cYhPUTS263tQf3xm5bb6-gMJiJH3heLaKWmBuiaFUozQxPDdY_4DzxXjJjiVePL9No5YsO640yNdeHmBcKU9cvEFcyxyV-mNxR-OaEblkS0PIEidMHS-jUTjTU7IjXgZBlMAh9p2MzGl3Mj9BYnZqBVZqSM2e1DSkrV-HHip7pRYai85_w9UfbBjt3ovCgCZ74j9YM5YKIZT_aDcPChy6G1NEf9ELe7Tf02x5lRKZ6djOu7xKf7OhRaqZbqbrdP84eO_Yvy2lrIB8tT_DnotGT9SdtScJuCggJqFPw-2QPW2qg-sejARRWSydV6H98jtE0BK6ddw2D1NPNzIL-wVpQCR8)

### 2. API Examples

#### Admin Endpoints

1. **Create Show**

```http
POST /admin/show
Content-Type: application/json

{
    "name": "Avengers: Endgame",
    "start_time": "2024-03-25T18:00:00Z",
    "total_seats": 100
}
```

Response (Success - 201):

```json
{
  "message": "Show created successfully",
  "show": {
    "id": 1,
    "name": "Avengers: Endgame",
    "start_time": "2024-03-25T18:00:00Z",
    "total_seats": 100,
    "booked_seats": 0,
    "created_at": "2024-03-19T10:00:00Z"
  }
}
```

Response (Error - 400):

```json
{
  "error": "All fields are required and must be valid"
}
```

#### User Endpoints

1. **Get All Shows**

```http
GET /shows
```

Response (Success - 200):

```json
[
  {
    "id": 1,
    "name": "Avengers: Endgame",
    "start_time": "2024-03-25T18:00:00Z",
    "total_seats": 100,
    "available_seats": 95
  },
  {
    "id": 2,
    "name": "The Dark Knight",
    "start_time": "2024-03-26T20:00:00Z",
    "total_seats": 80,
    "available_seats": 80
  }
]
```

2. **Book Seats**

```http
POST /book
Content-Type: application/json

{
    "show_id": 1,
    "seat_count": 2
}
```

Response (Success - 200):

```json
{
  "message": "Booking CONFIRMED",
  "booking": {
    "id": 1,
    "show_id": 1,
    "seat_count": 2,
    "status": "CONFIRMED",
    "created_at": "2024-03-19T10:00:00Z"
  }
}
```

Response (Failure - 200):

```json
{
  "message": "Booking FAILED",
  "booking": {
    "id": 2,
    "show_id": 1,
    "seat_count": 200,
    "status": "FAILED",
    "created_at": "2024-03-19T10:00:00Z"
  }
}
```

Response (Error - 400):

```json
{
  "error": "Invalid input"
}
```

Response (Error - 404):

```json
{
  "error": "Show not found"
}
```

Response (Error - 500):

```json
{
  "error": "Internal Server Error"
}
```

### 3. Core Components

#### API Layer (Express.js)

- RESTful endpoints for show and booking management
- Input validation and error handling
- JSON response formatting

#### Database Layer (PostgreSQL)

- Two main tables: `shows` and `bookings`
- Connection pooling for efficient database access
- Transaction support for data consistency

#### Background Jobs

- Booking expiry checker (runs every minute)
- Automatically marks pending bookings as failed after 2 minutes

### 4. Database Schema

```sql
-- Shows table
CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INT NOT NULL,
  booked_seats INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  show_id INT REFERENCES shows(id) ON DELETE CASCADE,
  seat_count INT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED')) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Concurrency Handling

#### Current Implementation

1. **Transaction-based Booking**

   - All booking operations are wrapped in transactions
   - Uses `BEGIN` and `COMMIT` for atomicity
   - Automatic rollback on errors

2. **Row-level Locking**

   - `FOR UPDATE` lock on show rows during booking
   - Prevents concurrent modifications to the same show
   - Ensures seat count accuracy

3. **Booking Status Flow**
   ```
   PENDING → CONFIRMED (if seats available)
   PENDING → FAILED (if seats unavailable or expired)
   ```

### 6. API Endpoints

#### Admin Routes

```
POST /admin/show
- Create new show
- Required fields: name, start_time, total_seats
```

#### User Routes

```
GET /shows
- List all available shows
- Returns show details with available seats

POST /book
- Book seats for a show
- Required fields: show_id, seat_count
- Returns booking status (CONFIRMED/FAILED)
```

### 7. Error Handling

- Input validation for all requests
- Proper HTTP status codes
- Descriptive error messages
- Transaction rollback on errors

## Conclusion

The current implementation provides a solid foundation for a ticket booking system with:

- Reliable concurrency handling
- Data consistency
- Automatic booking expiry
- Clean API design

The system is ready for basic usage and can be extended with additional features as needed.

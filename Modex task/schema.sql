CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INT NOT NULL,
  booked_seats INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  show_id INT REFERENCES shows(id) ON DELETE CASCADE,
  seat_count INT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED')) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);

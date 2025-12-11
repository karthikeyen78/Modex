# Ticket Booking System

A full-stack ticket booking application featuring a Node.js/Express backend and a React/TypeScript frontend.

## Features

- **Admin Dashboard**: Create and view shows.
- **User Dashboard**: Browse available shows in real-time.
- **Booking System**: Select seats visually and book with concurrency safety.
- **Concurrency Handling**: Backend uses database transactions and locking to prevent race conditions.
- **Expiry Job**: Background job cleans up stale bookings.

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Database**: PostgreSQL (Supabase compatible)

## Setup Instructions

### Backend
1. `cd` into root directory.
2. `npm install`
3. Set up `.env` with `DATABASE_URL` (Postgres).
4. Run `node schema.sql` content in your DB to create tables (or use a migration tool).
5. `npm start` (Runs on port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

## API Documentation

- `GET /shows`: List all shows.
- `POST /book`: Book seats. Body: `{ show_id, seat_count }`.
- `POST /admin/show`: Create show. Body: `{ name, start_time, total_seats }`.

## Deployment

- **Backend**: Ready for Render/Railway/Heroku.
- **Frontend**: Ready for Vercel/Netlify.

## Documentation

- **[System Design & Architecture](./SYSTEM_DESIGN.md)**: Detailed breakdown of scalability, concurrency, and architecture.
- **[Technical API Design](./TECHNICAL_DESIGN.md)**: API contracts and database schema.


- **Read Replicas**: Separate Read/Write operations. Use a primary DB for Booking (Writes) and Read Replicas for `GET /shows` (Reads). This offloads the heavy read traffic from the primary node.
- **Connection Pooling**: Use `pg-pool` (already implemented) to manage DB connections efficiently.
- **Sharding**: For massive scale, shard the `bookings` table by `show_id` or `region` to distribute data across multiple physical machines.

### B. Caching Strategy
- **Redis Cache**: Implement Redis to cache the response of `GET /shows`.
    - **Invalidation**: Invalidate the cache whenever a booking is confirmed (`POST /book`) or a new show is added.
    - **Benefit**: Reduces load on Postgres significantly for high-traffic browsing pages.

### C. Backend Scaling
- **Load Balancer**: Place NGINX or AWS ALB in front of multiple Node.js instances.
- **Horizontal Scaling**: Since the API is stateless, we can spin up `N` instances of the backend container (e.g., using Kubernetes or AWS ECS) to handle concurrent requests.

### D. Message Queue (Async Processing)
- **Role**: Decouple critical booking flow from non-critical tasks.
- **Usage**:
    - When a booking is confirmed, publish an event to a queue (RabbitMQ/Kafka).
    - Consumers process email notifications, analytics updates, and third-party integrations asynchronously.

## 3. Concurrency & Data Consistency

Handling 2,500 candidates or high-traffic launches requires strict concurrency controls.

### Current Implementation (Pessimistic Locking)
We use **Row-Level Locking** via `SELECT ... FOR UPDATE` in Postgres.
1.  **Transaction Start**: `BEGIN`
2.  **Lock**: `SELECT * FROM shows WHERE id = $1 FOR UPDATE`. This locks the specific show row. No other transaction can modify this show until the current one commits or rolls back.
3.  **Check**: Verify `available_seats >= request_count`.
4.  **Update**: Increment `booked_seats` and Insert `booking` record.
5.  **Commit**: `COMMIT`.

**Why this choice?**
- Guarantees **Strong Consistency**. It is impossible to overbook because the lock forces serialization of requests for the same show.
- Trade-off: Lower throughput for a *single* show, but safe.

### Alternative (Optimistic Locking)
For lower contention, we could use version numbers or check constraints in the `UPDATE` clause:
```sql
UPDATE shows SET booked_seats = booked_seats + 1 
WHERE id = $1 AND booked_seats < total_seats;
```
If `row_count` is 0, the booking fails. This avoids heavy DB locks but requires application-level retries.

## 4. Frontend Architecture

### State Management
- **Context API** is used for global state (if needed), but currently, we rely on **Server State** management.
- We minimize client-side state by fetching fresh data on navigation, ensuring users see up-to-date availability.

### User Experience
- **Optimistic UI**: (Future improvement) Show "Booked" immediately while the API processes, reverting on failure.
- **Error Handling**: Centralized error capture displays friendly messages for "Sold Out" or "Network Error" scenarios.

## 5. Deployment Pipeline

### Backend (Render/Railway)
1.  Connect GitHub Repo.
2.  Set Build Command: `npm install`.
3.  Set Start Command: `node index.js`.
4.  Env Vars: `SUPABASE_URL`, `PORT`.

### Frontend (Vercel)
1.  Connect GitHub Repo.
2.  Set Root Directory: `frontend`.
3.  Set Build Command: `npm run build`.
4.  Env Vars: `VITE_API_URL` (Link to backend URL).

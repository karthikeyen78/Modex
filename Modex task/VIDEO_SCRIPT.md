# Video Walkthrough Script

Use this script as a guide for your 5-minute video submission.

## 1. Introduction & Objective (30s)
*   **Hook**: "Hi, I'm [Your Name]. This is my submission for the Ticket Booking System assignment."
*   **Problem Statement**: "I built a full-stack platform to solve the problem of high-concurrency ticket booking, similar to BookMyShow or RedBus, preventing overbooking race conditions."
*   **Tech Stack**: "I used React and TypeScript for the frontend (hosted on Vercel) and Node.js/Express with PostgreSQL for the backend (hosted on Render/Railway)."

## 2. Architecture Overview (1 min)
*(Show your `SYSTEM_DESIGN.md` or a diagram if you have one)*
*   **Frontend**: "The frontend is built with React 19 and TailwindCSS for a premium, responsive feel. I used a component-based architecture."
*   **Backend**: "The backend is a REST API. I prioritized statelessness for scalability."
*   **Database**: "I used PostgreSQL because its ACID properties are essential for transactional integrity in booking systems."

## 3. Product Demo (2 mins)
*(Switch to your live deployed site)*

**A. Admin Flow**
*   "First, let's log in as Admin." (Go to `/admin`)
*   "I can view all current shows."
*   "Let's create a new show: 'Coldplay Concert', 50 seats." (Fill form & Submit).
*   "You can see it appears instantly in the list."

**B. User Flow**
*   "Now, switching to the User view." (Go to `/`)
*   "I can see the 'Coldplay Concert' we just added. It shows 'Available'."
*   "Let's book it." (Click Book).
*   "I've implemented a visual seat selection grid." (Click 2 seats).
*   "Click Confirm. You'll see the status changes to green."

## 4. Technical Deep Dive / Innovation (1 min)
*(Switch to VS Code -> `controllers/userController.js`)*
*   **Concurrency**: "The biggest challenge was handling concurrent bookings. If 100 users click 'Book' on the last seat at the exact same millisecond, standard code would fail."
*   **Solution**: "I implemented **Pessimistic Locking** using Postgres transactions (`BEGIN` ... `COMMIT`)."
*   **Code**: "Here, I use `SELECT ... FOR UPDATE` to lock the show row. This ensures that only one transaction can modify the seat count at a time, guaranteeing data consistency."

## 5. Conclusion (15s)
*   "In summary, this project demonstrates not just a working app, but a scalable, concurrency-safe system ready for production loads."
*   "Thank you for watching."

# paste-bin

# Pastebin Lite – MERN Stack Application

A small Pastebin-like web application where users can create text pastes, generate shareable links, and view the content.  
Pastes can optionally expire based on time (TTL) or number of views.

This project was built as a backend-focused take-home exercise and is fully tested using automated-style API tests.

---

## 🚀 Deployed Application

Live URL:  
https://paste-bin-kappa.vercel.app/

---

## 📌 Features

- Create a paste with arbitrary text content
- Generate a shareable URL for each paste
- View paste content using the shared link
- Optional time-based expiration (TTL)
- Optional view-count limit
- Automatic deletion when constraints are triggered
- Safe HTML rendering (prevents script execution)
- Deterministic time handling for automated testing
- MongoDB persistence (data survives across requests)

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas (cloud database)
- Mongoose ODM

### Frontend
- React (Vite)
- Tailwind CSS

### Hosting
- Vercel (Serverless deployment)

---

## 🧩 Application Architecture

The app follows a simple MERN-style structure:

backend/
├ controllers/
├ routes/
├ models/
└ app.js

frontend/
└ paste-bin/
└ src/


### Backend Responsibilities
- API endpoints for creating and fetching pastes
- TTL and view-limit logic
- HTML fallback page for paste viewing
- MongoDB persistence

### Frontend Responsibilities
- User interface for creating pastes
- Viewing pastes with metadata (views remaining, expiry time)
- Navigation (Navbar, Footer, Pages)

---

## 📡 API Routes

### Health Check

GET  
/api/healthz


Response:

```json
{
  "ok": true
}

Create Paste

POST
/api/pastes

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}


Rules:

content is required and must be non-empty

ttl_seconds optional (>=1)

max_views optional (>=1)

Response:
{
  "id": "pasteId",
  "url": "https://paste-bin-kappa.vercel.app/p/pasteId"
}

Fetch Paste (JSON API)

GET /api/pastes/:id
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
Unavailable cases return:

404 Not Found

View Paste (HTML)

GET

/p/:id


Returns a styled HTML page containing the paste content.

If unavailable:

404 Not Found

⏱ Deterministic Time Handling

To support automated testing for TTL expiry:

If environment variable is set:

TEST_MODE=1


And request includes header:

x-test-now-ms: <timestamp in milliseconds>


The backend treats that timestamp as the current time for expiry calculations.

This allows instant TTL simulation without waiting in real time.

💾 Persistence Layer

MongoDB Atlas (cloud-hosted MongoDB) is used for storing pastes.

Reasons:

Works well with serverless platforms like Vercel

Reliable persistence across requests

Free tier sufficient for this assignment

📥 Clone and Run Locally
1️⃣ Clone repository
git clone <your-repository-url>
cd <project-folder>

2️⃣ Backend setup
cd backend
npm install


Create .env file:

MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=development


Run backend:

npm start


Backend runs on:

http://localhost:8000

3️⃣ Frontend setup
cd frontend/paste-bin
npm install
npm run dev


Frontend runs on:

http://localhost:5173

4️⃣ Production-style run (optional)

Build frontend:

npm run build


Then start backend which serves frontend statically.

🧪 Testing

All API endpoints were tested manually using Thunder Client:

Health check

Paste creation

JSON retrieval

HTML rendering

TTL expiry

View limits

Deterministic TTL using custom header

Invalid input handling

The behavior matches the expected automated test scenarios.

📈 Design Decisions

Used serverless-friendly architecture for Vercel

MongoDB Atlas chosen for persistence over in-memory storage

Separate JSON API and HTML fallback route for flexibility

Implemented deterministic time logic for fast TTL testing

Kept frontend and backend decoupled but served under one domain

✅ Compliance with Assignment Requirements

✔ Paste creation and sharing
✔ TTL expiry support
✔ View count limit support
✔ HTML paste view
✔ JSON API responses
✔ Deterministic expiry testing
✔ Cloud persistence
✔ Deployed on Vercel
✔ No hardcoded localhost URLs

👤 Author

Sravan Kumar
MERN Stack Developer
Deployed Link (https://paste-bin-kappa.vercel.app/)


---

# 🎯 What to do now

1️⃣ Create file at project root:



README.md


2️⃣ Paste the above content  
3️⃣ Update:

- `<your-repository-url>`  
- (optional) add your name/github  

4️⃣ Commit & push:

```bash
git add README.md
git commit -m "Add detailed README"
git push
# SmartTask Pro

Production-ready MERN SaaS task management: Express + MongoDB + JWT backend and React (Vite) + Tailwind frontend.

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster **or** local MongoDB (`mongodb://127.0.0.1:27017/smarttask-pro`)

## Backend (`server/`)

1. Copy environment file:

   `cp .env.example .env` (Linux/macOS) or copy `.env.example` to `.env` on Windows.

2. Set variables in `.env`:

   - `MONGO_URI` — Atlas connection string or local URI
   - `JWT_SECRET` — long random string (required)
   - `PORT` — default `5000`
   - `CLIENT_URL` — optional, comma-separated frontend origins for CORS (e.g. your Vercel URL). Local `http://localhost:5173` is always allowed when this is set.

3. Install and run:

```bash
cd server
npm install
npm run dev
```

Health check: `GET http://localhost:5000/api/health`

## Frontend (`client/`)

1. Copy `.env.example` to `.env`.

2. Set `VITE_API_URL` to your API origin **without** `/api` (e.g. `http://localhost:5000`). For local dev you can leave it empty to use the Vite proxy (`/api` → `http://localhost:5000`).

3. Install and run:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## MongoDB Atlas

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Database Access: create a database user.
3. Network Access: allow your IP (or `0.0.0.0/0` for testing only).
4. Connect → Drivers → copy the connection string and replace `<password>`.
5. Append a database name if needed, e.g. `...mongodb.net/smarttask-pro?retryWrites=true&w=majority`.
6. Put the string in `server/.env` as `MONGO_URI`.

## Deployment notes

- **API (Render / Railway / VPS):** set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL` to your production frontend URL(s).
- **Frontend (Vercel):** set `VITE_API_URL` to the public API base (e.g. `https://api.yourapp.com`). Build command: `npm run build`, output directory: `dist`.
- Ensure CORS: production frontend origin must be included via `CLIENT_URL` on the server.

## API summary

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/profile` | Bearer JWT |
| POST | `/api/tasks` | Bearer JWT |
| GET | `/api/tasks?filter=all\|completed\|pending\|high` | Bearer JWT |
| PUT | `/api/tasks/:id` | Bearer JWT |
| DELETE | `/api/tasks/:id` | Bearer JWT |

JWT is returned on register/login; send `Authorization: Bearer <token>` for protected routes.

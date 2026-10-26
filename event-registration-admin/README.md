# Gatherly — Event Registration Admin Panel

A MERN stack application for managing event information through an administrative dashboard.

## Technologies
- MongoDB Atlas
- Express.js
- React.js and Vite
- Node.js
- Axios and React Router
- Lucide React icons
- Responsive CSS

## Features
- Dashboard listing event ID, name, date, venue, and registration count
- Add, update, and delete events
- Search by event name, venue, or description
- Responsive layout
- MongoDB Atlas persistence

## Project structure
- `frontend/` — React user interface
- `backend/` — Express REST API and MongoDB model

## Setup

### 1. Configure MongoDB Atlas
Create a MongoDB Atlas database and a database user. Ensure network access allows your development machine. Copy `backend/.env.example` to `backend/.env` and fill in the real connection URI locally.

### 2. Start backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start frontend in another terminal
Copy `frontend/.env.example` to `frontend/.env`, then run:
```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API endpoints
| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

Registration count defaults to zero. This project does not include attendee registration creation, so counts will not increase automatically.

## Security
Do not commit real `.env` files or database credentials. Commit the `.env.example` templates instead.

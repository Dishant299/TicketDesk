# Ticket Desk — Support CRM

A full-stack customer support ticketing system built with the MERN stack (MongoDB, Express, React, Node.js). Support agents can create tickets, search and filter them instantly, view ticket details, update status, and leave internal notes.

**Live app:** https://ticket-desk-lilac.vercel.app/

---

## Features

- **Create tickets** — customer name, email, subject, description; ticket ID (`TKT-001`, `TKT-002`, ...) and timestamp are auto-generated.
- **List all tickets** — dashboard view with counts (All / Open / In Progress / Closed) and a card list showing ID, subject, customer, status, and date.
- **Instant search** — filters across ticket ID, subject, customer name, and email as you type, no page reload.
- **Filter by status** — Open / In Progress / Closed / All.
- **Ticket detail view** — full ticket info, one-click status changes, and a running thread of internal notes.

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React 19 (Vite), React Router, Tailwind CSS   |
| Backend    | Node.js, Express 5                            |
| Database   | MongoDB (Mongoose ODM)                        |
| Deployment | Vercel (frontend + serverless backend)        |

## Project Structure

```
TicketDesk/
├── client/                  # React (Vite) frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx         # ticket list, search, filter, stats
│       │   ├── NewTicket.jsx    # create ticket form
│       │   └── TicketDetail.jsx # ticket detail, status update, notes
│       ├── api.js               # fetch wrapper for backend API
│       └── App.jsx              # routes & layout
├── server/                  # Express backend
│   └── src/
│       ├── config/db.js         # MongoDB connection
│       ├── models/
│       │   ├── Ticket.js
│       │   └── Note.js
│       ├── controllers/ticketController.js
│       ├── routes/tickets.js
│       └── server.js
└── README.md
```

## Database Schema

**Ticket**
| Field          | Type   | Notes                              |
|----------------|--------|-------------------------------------|
| ticket_id      | String | unique, auto-generated (TKT-00N)   |
| customer_name  | String | required                           |
| customer_email | String | required                           |
| subject        | String | required                           |
| description    | String |                                     |
| status         | String | enum: Open / In Progress / Closed  |
| created_at     | Date   | auto (timestamps)                  |
| updated_at     | Date   | auto (timestamps)                  |

**Note**
| Field     | Type     | Notes                     |
|-----------|----------|----------------------------|
| ticketId  | ObjectId | ref → Ticket               |
| content   | String   | required                   |
| author    | String   | required                   |
| createdAt | Date     | default: now               |

## API Endpoints

| Method | Endpoint                | Description                                      |
|--------|--------------------------|---------------------------------------------------|
| POST   | `/api/tickets`           | Create a ticket                                   |
| GET    | `/api/tickets`           | List tickets, optional `?status=` and `?search=`  |
| GET    | `/api/tickets/:ticket_id`| Get one ticket with its notes                     |
| PUT    | `/api/tickets/:ticket_id`| Update status and/or add a note                   |

Running Locally
Prerequisites
Node.js 18+
A MongoDB connection string (local MongoDB or a free MongoDB Atlas cluster)
1. Clone the repo
bash
git clone https://github.com/Dishant299/TicketDesk.git
cd TicketDesk
2. Backend setup
bash
cd server
npm install
cp .env.example .env
# edit .env and add your MONGODB_URI
npm run dev

The API runs on http://localhost:4000 by default.

3. Frontend setup

In a new terminal:

bash
cd client
npm install
cp .env.example .env
# edit .env if your API runs on a different URL
npm run dev

The app runs on http://localhost:5173 by default.

Environment Variables

server/.env

MONGODB_URI=your_mongodb_connection_string
PORT=4000

client/.env

VITE_API_URL=http://localhost:4000/api
Deployment

Both the frontend and backend are deployed on Vercel, pointed at a MongoDB Atlas cluster. VITE_API_URL in the frontend's Vercel project settings points at the deployed backend's /api route.

Author

Dishant Bhimani LinkedIn

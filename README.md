# TaskFlow — Bookings & Tasks MVP

A full-stack task/booking manager with a Next.js frontend and a Node.js/Express + PostgreSQL backend, all in one repository.

I built this project using Next.js for server-side rendering and faster page loads. I chose Tailwind CSS for styling because it allows rapid UI development without switching between files. The state is managed using React Context to keep it simple, since the app is small. I structured the code by feature (not by file type) to make it easier to scale.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | Node.js, Express 4                |
| Database  | PostgreSQL (via `pg` pool)        |
| Dev Tools | concurrently, nodemon             |

---

## Project Structure

```
task-flow/
├── package.json            ← root scripts (dev, build, install:all)
│
├── backend/
│   ├── src/
│   │   ├── index.js        ← Express app entry point
│   │   ├── db/
│   │   │   ├── pool.js     ← pg connection pool
│   │   │   └── init.js     ← schema migration script
│   │   ├── controllers/
│   │   │   └── tasks.controller.js
│   │   ├── routes/
│   │   │   └── tasks.routes.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx    ← main dashboard page
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskForm.tsx
    │   │   ├── StatsBar.tsx
    │   │   ├── DeleteConfirm.tsx
    │   │   └── EmptyState.tsx
    │   ├── hooks/
    │   │   └── useTasks.ts
    │   ├── lib/
    │   │   └── api.ts      ← typed fetch wrapper
    │   └── types/
    │       └── task.ts
    ├── .env.example
    ├── next.config.js      ← proxy /api/* → backend
    ├── tailwind.config.js
    └── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 running locally (or a hosted instance)

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd task-flow
npm run install:all
```

### 2. Configure environment variables

**Backend** — copy and edit:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskflow
NODE_ENV=development
```

**Frontend** — copy and edit:

```bash
cp frontend/.env.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Create the database

```bash
createdb taskflow        # using psql CLI, or use pgAdmin
```

### 4. Initialise the schema

```bash
cd backend && npm run db:init
```

This creates the `tasks` table with an auto-update trigger for `updated_at`.

### 5. Run in development

From the root:

```bash
npm run dev
```

This starts both servers concurrently:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:4000       |
| Health   | http://localhost:4000/api/health |

---

## API Reference

All endpoints are prefixed with `/api/tasks`.

| Method | Path           | Description                        |
|--------|----------------|------------------------------------|
| GET    | `/`            | List tasks (filterable/searchable) |
| GET    | `/stats`       | Aggregate counts                   |
| GET    | `/:id`         | Get single task                    |
| POST   | `/`            | Create task                        |
| PUT    | `/:id`         | Update task (partial)              |
| DELETE | `/:id`         | Delete task                        |

### Query parameters for `GET /`

| Param    | Values                                       |
|----------|----------------------------------------------|
| status   | `pending`, `in_progress`, `completed`, `cancelled` |
| priority | `low`, `medium`, `high`                      |
| search   | free text (searches title + description)     |
| sort     | `created_at`, `updated_at`, `due_date`, `title`, `priority` |
| order    | `asc`, `desc`                                |

### Task schema

```json
{
  "id":          "uuid",
  "title":       "string (required, max 255)",
  "description": "string | null",
  "status":      "pending | in_progress | completed | cancelled",
  "priority":    "low | medium | high",
  "due_date":    "ISO 8601 datetime | null",
  "created_at":  "ISO 8601 datetime",
  "updated_at":  "ISO 8601 datetime"
}
```

---

## Technical Approach

### Backend

- **Express** serves a RESTful JSON API with clean separation between routes, controllers, and middleware.
- **pg pool** manages PostgreSQL connections efficiently; the pool is shared across all requests.
- **Validation** is done in the controller before any DB query — no ORM, just parameterised SQL to prevent injection.
- A **PostgreSQL trigger** automatically updates `updated_at` on every row update, keeping the logic in the database where it belongs.
- A centralised **error handler** normalises pg error codes (duplicate key, invalid UUID, etc.) into consistent HTTP responses.

### Frontend

- **Next.js App Router** with a single-page dashboard; the `next.config.js` rewrite proxies `/api/*` to the Express backend, keeping the client-side fetch calls simple.
- **`useTasks` hook** encapsulates all server state — loading, error, optimistic refresh — so the page component stays clean.
- **Typed API client** (`lib/api.ts`) wraps `fetch` with shared error handling and TypeScript generics.
- UI is styled with **Tailwind CSS** using a warm editorial palette (Playfair Display + DM Sans), CSS animations for modals/cards, and fully responsive grid layout.

---

## Deployment notes

- Set `NODE_ENV=production` on the backend; the pg pool will enable SSL (`rejectUnauthorized: false` for most managed DBs — tighten for production).
- Point `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- Run `npm run build` inside `frontend/` to produce an optimised Next.js build.

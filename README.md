# Task Management System

This is a task manager I built for the Koncepthive full-stack intern assessment. You log in, and from there you can add tasks, edit them, delete them, search and filter through them, and see a quick summary of where everything stands.

## What it does

Once you're logged in you land on a dashboard. At the top there are five counters (total, pending, in progress, completed, and overdue), and below that is the list of your tasks. Every task has a title, an optional description, a priority, a status, and a due date.

You can search tasks by title, filter by status and priority at the same time, and sort by newest, oldest, or due date. I also added a few extra things: a sidebar where "My Tasks" and "Add Task" open in popups, a dark mode toggle, and a layout that works on phones and tablets, not just desktop.

Validation runs in two places. The frontend checks things as you type so you get instant feedback, but the backend re-checks everything too, since anyone could get around the frontend. The backend is the one I actually trust.

## Tech I used

Frontend: React (with Vite), React Router, Axios, Tailwind CSS, react-hot-toast for the little popup messages, and lucide-react for icons.

Backend: Node with Express, written in TypeScript. I used the `pg` library to talk to PostgreSQL, `jsonwebtoken` for the login tokens, `bcryptjs` to hash passwords, and Zod to validate incoming requests.

Database: PostgreSQL 18.

## Getting it running

You'll need Node 18+, PostgreSQL, and npm.

Clone it and you'll see three folders — `backend`, `frontend`, and `database`:

```bash
git clone https://github.com/<your-username>/task-manager.git
cd task-manager
```

### Environment variables

The backend needs a `.env` file. Copy the example and fill it in:

```bash
cd backend
cp .env.example .env
```

Inside it you set the port, your PostgreSQL connection details (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), a `JWT_SECRET` (just a long random string), how long tokens last (`JWT_EXPIRES_IN`), the seeded admin details (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`), and `CLIENT_URL` for CORS.

The frontend needs one variable in its own `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### Setting up the database

Create the database:

```bash
createdb task_manager01
```

On Windows I had to use the full path because `createdb` wasn't on my PATH:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres task_manager01
```

Then load the schema, which creates the two tables plus some indexes and triggers:

```bash
psql -U postgres -d task_manager01 -f database/schema.sql
```

I didn't put the admin user in the schema file. Instead there's a seed script that hashes the password properly with bcrypt and inserts the admin — that felt cleaner than pasting a hash into SQL:

```bash
cd backend
npm install
npm run seed
```

After that you can log in with `admin@test.com` / `123456`.

### Running the backend

```bash
cd backend
npm install
npm run dev
```

It runs on `http://localhost:5000`. There's a `GET /health` route if you want to check it's alive.

### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

That runs on `http://localhost:5173`.

### Running with Docker

If you'd rather not set up Node and PostgreSQL separately, there's Docker support. From the project root:

```bash
docker compose up --build
```

This starts three containers together: PostgreSQL (with the schema loaded automatically), the backend, and the frontend. Once it's up:

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`
- Database: `localhost:5432`

The backend, frontend, and database each have their own setup — the two Dockerfiles use a multi-stage build (one stage compiles the code, a smaller final stage just runs it), and `docker-compose.yml` wires them together. Inside Docker the backend reaches the database using the service name `db` as its host instead of `localhost`, since that's how the containers find each other on Docker's internal network.

Log in with the same `admin@test.com` / `123456`.

## The API

Everything sits under `http://localhost:5000/api`. All the task routes need the JWT you get back from logging in, sent as an `Authorization: Bearer <token>` header.

**POST `/auth/login`** — send email and password, get back a token and the user.

**GET `/tasks`** — your tasks. You can add `search`, `status`, `priority`, and `sort` as query params, and they combine. Search is case-insensitive on the title.

**GET `/tasks/stats`** — the five numbers for the dashboard.

**GET `/tasks/:id`** — one task.

**POST `/tasks`** — create one. Needs title, priority, status, and due date; description is optional.

**PUT `/tasks/:id`** — update one. You only have to send the fields you're changing.

**DELETE `/tasks/:id`** — delete one.

When validation fails, the response looks like this so the frontend can show the message next to the right field:

```json
{ "message": "Validation failed", "errors": { "title": "Title is required" } }
```

## Some decisions I made

There's only the one admin user and no signup page, because the assessment said so. But I still linked tasks to a `user_id`, so if I ever added registration the structure would already handle multiple users.

I don't store whether a task is overdue. I work it out on the fly — if it's not completed and the due date is in the past, it's overdue. Storing it would mean updating rows every day, which seemed pointless.

For the due-date check I compare dates as plain `YYYY-MM-DD` text instead of turning them into Date objects. I ran into a timezone bug where yesterday's date was sneaking through, and comparing the strings fixed it.

Priority and status can only be their allowed values, and I enforce that in three places: the database, the backend, and the frontend.

## Things I know aren't perfect

Logout just deletes the token from the browser. Because JWTs are stateless, the token technically stays valid until it expires — I can't kill it server-side without extra work. That's the tradeoff of using JWT.

There's no refresh token, just the one access token.

Search only looks at the title, not the description, which is what the spec asked for.

The backend works out "today" using the server's timezone. Locally that's fine, but on a server in a different timezone it could be off by a few hours.

If it's deployed on a free hosting tier, the first request after it's been idle for a while might be slow while the server wakes up.

## Extra features I added

Dark mode that remembers your choice, loading spinners, toast notifications, Docker support, and a responsive layout with a sidebar that collapses on mobile.

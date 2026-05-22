# SNIPPET

A small microservices example for creating and commenting on code snippets. This repository demonstrates a minimal event-driven architecture with separate services for snippets, comments, a query aggregation service, a message broker, and a Vite + React frontend.

This README explains the tech stack, folder layout, available API endpoints, environment configuration, and step-by-step setup instructions so a beginner can run the project locally.

---

## Table of contents

- Project overview
- Tech stack
- Folder structure
- API endpoints
- Environment variables (examples)
- Setup & run (per service)
- Testing the system (quick smoke test)
- Screenshots
- Troubleshooting

---

## Project overview

This project is divided into small services that communicate using an event broadcast endpoint (`/events`) handled by a message broker. The services are:

- `snippet` – creates and lists snippets (port 8000)
- `comments` – creates and lists comments for a snippet (port 8001)
- `queryService` – aggregates snippets + comments for read queries (port 8002)
- `messageBroker` – forwards events to the other services (port 8005)
- `client/codesnippet` – Vite + React frontend (port 5173)

Each service is intentionally tiny to make the architecture and flow easy to understand.

## Tech stack

- Node.js + Express for backend services
- Axios for internal HTTP calls between services
- Vite + React for the frontend
- CORS and simple JSON over HTTP for inter-service communication
- Nodemon used for local development

## Folder structure

Top-level layout:

```
README.md
client/
	codesnippet/        # React + Vite frontend
comments/             # Comments service (Express)
messageBroker/        # Broadcasts events to services
queryService/         # Aggregates data for reads
snippet/              # Snippet service (Express)
```

Service folders all have a small Express app in `index.js` and a `package.json` with a `dev` or `start` script.

## API endpoints

The key API endpoints you will use while testing the app are:

- Snippet service (`http://localhost:8000`)
	- POST `/api/v1/snippet` – create a snippet
		- body example: `{ "title": "My snippet", "id": "<uuid>" }`
	- GET `/api/v1/snippet` – list snippets (service-level data)

- Comments service (`http://localhost:8001`)
	- POST `/api/v1/snippet/:id/comment` – create a comment for snippet `:id`
		- body example: `{ "id": "<uuid>", "content": "Nice snippet", "snippetId": "<id>" }`
	- GET `/api/v1/snippet/:id/comment` – list comments for snippet `:id`

- Query service (`http://localhost:8002`)
	- GET `/snippets` – aggregated read model (snippets with comments)
	- POST `/events` – accepts events to update its aggregated state

- Message broker (`http://localhost:8005`)
	- POST `/events` – forwards received events to all services

Notes:
- All services also expose a `POST /events` handler (used by the message broker) to accept system events. When you create a snippet or comment the broker should forward those events so the `queryService` can update its read model.

## Environment variables (examples)

Currently the services use fixed ports in their code. To make this beginner-friendly you can create simple `.env` files and adapt the `index.js` files to use `process.env.PORT` if you wish. Example `.env` files (optional):

`snippet/.env`
```
PORT=8000
FRONTEND_ORIGIN=http://localhost:5173
BROKER_URL=http://localhost:8005
```

`comments/.env`
```
PORT=8001
FRONTEND_ORIGIN=http://localhost:5173
BROKER_URL=http://localhost:8005
```

`queryService/.env`
```
PORT=8002
```

`messageBroker/.env`
```
PORT=8005
```

The code currently hardcodes ports and origins; adding `dotenv` and switching to `process.env.*` is a good exercise.

## Setup & run (beginner-friendly)

Prerequisites:

- Node.js (v16 or later recommended)
- npm (comes with Node) or another package manager

1) Clone / open the repo and install dependencies for each service.

Run these commands in separate terminals (one per service) or use a terminal multiplexer.

Snippet service

```bash
cd snippet
npm install
npm run dev
```

Comments service

```bash
cd comments
npm install
npm run dev
```

Query service

```bash
cd queryService
npm install
npm run dev
```

Message broker

```bash
cd messageBroker
npm install
npm run dev
```

Frontend (Vite + React)

```bash
cd client/codesnippet
npm install
npm run dev
```

Notes:
- The services use `nodemon` in `dev` scripts so changes auto-restart the server.
- Frontend runs on port `5173` by default (Vite).

## Testing the system (quick smoke test)

1. Start all services and the frontend as described above.
2. Open the frontend at `http://localhost:5173` and use the UI to create a snippet and add comments.
3. Verify the query service aggregated data:

```bash
curl http://localhost:8002/snippets
```

You should see created snippets with nested `comments` arrays.

If you prefer to test with raw HTTP requests:

- Create a snippet:

```bash
curl -X POST http://localhost:8000/api/v1/snippet \
	-H "Content-Type: application/json" \
	-d '{"id":"1","title":"Hello"}'
```

- Create a comment:

```bash
curl -X POST http://localhost:8001/api/v1/snippet/1/comment \
	-H "Content-Type: application/json" \
	-d '{"id":"10","content":"Nice!","snippetId":"1"}'
```

After those requests, check `http://localhost:8002/snippets` to see the aggregated result.

## Screenshots

Add screenshots of the running frontend and responses here to help beginners. Example files you might include in the `client/codesnippet/public` folder:

- `screenshot-frontend.png` – UI showing a snippet and its comments
- `screenshot-curl-output.png` – JSON response from the query service

To embed screenshots in this README once you add them, use Markdown:

```md
![Frontend screenshot](client/codesnippet/public/screenshot-frontend.png)
```

## Troubleshooting

- CORS errors: ensure the frontend origin (`http://localhost:5173`) is allowed by the service CORS configuration.
- Port in use: change the port number in `index.js` or stop the process using the port.
- Events not arriving: check that the `messageBroker` is running and that services respond with 200 on `/events`.

## Next steps and improvements (suggestions)

- Move port/origin configuration into `.env` and use `dotenv`.
- Replace in-memory stores with a real database (Mongo/Postgres) for persistence.
- Add proper logging and health checks.
- Add automated tests for the HTTP endpoints.

---

If you'd like, I can also:

- add .env support and example files for each service,
- switch the code to use `process.env.PORT` and update `package.json` scripts,
- or add a Docker Compose file to run all services together.

Tell me which you prefer and I will implement it.

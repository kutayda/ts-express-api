# TypeScript Express API

A small REST API built with **TypeScript** and **Express** while learning Node.js backend development. It stores people in a SQLite database and supports creating, reading and deleting records.

## Tech Stack

- Node.js
- TypeScript
- Express
- tsx (run TypeScript directly)
- SQLite (better-sqlite3)

## Getting Started

```bash
npm install
npx tsx server.ts
```

The server starts on `http://localhost:3000`.

## Endpoints

| Method | Route            | Description                  | Success | Errors |
|--------|------------------|------------------------------|---------|--------|
| GET    | `/kisiler`       | List all people              | 200     | -      |
| GET    | `/kisiler/:id`   | Get a single person by id    | 200     | 404    |
| POST   | `/kisiler`       | Create a new person          | 201     | 400    |
| DELETE | `/kisiler/:id`   | Delete a person by id        | 204     | 404    |

### Example: create a person

```bash
curl -X POST http://localhost:3000/kisiler \
  -H "Content-Type: application/json" \
  -d '{"name": "Zeynep", "email": "zeynep@zeynep.com"}'
```

Response (`201 Created`):

```json
{ "id": 4, "name": "Zeynep", "email": "zeynep@zeynep.com" }
```

If `name` or `email` is missing, the API returns `400` with an error message.

## What I Practiced

- Typing data with TypeScript interfaces (`Kisi`)
- Route parameters (`req.params`) and request bodies (`req.body`)
- HTTP status codes (200, 201, 204, 400, 404)
- Input validation and early returns
- Testing endpoints with `fetch` scripts
- Persisting data with SQLite and parameterized SQL queries

## Notes

- Data is persisted in a SQLite database (kisiler.db, created automatically on first run).

## Roadmap

- [x] Persist data with SQLite
- [ ] Authentication with JWT
- [ ] Tests
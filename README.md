# TypeScript Express API

A small REST API built with **TypeScript** and **Express** while learning Node.js backend development. It stores people in a SQLite database, supports user registration and login with **JWT** authentication, and protects write operations behind a token.

## Tech Stack

- Node.js
- TypeScript
- Express
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- tsx (run TypeScript directly)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with a secret used to sign tokens:

```
JWT_SECRET=replace-this-with-a-long-random-string
```

3. Start the server:

```bash
npx tsx --env-file=.env server.ts
```

The server starts on `http://localhost:3000`. The SQLite database (`kisiler.db`) is created automatically on first run. The server refuses to start if `JWT_SECRET` is not set.

## Endpoints

| Method | Route            | Description                      | Auth | Success | Errors        |
|--------|------------------|----------------------------------|------|---------|---------------|
| POST   | `/register`      | Create a user account            | No   | 201     | 400, 409      |
| POST   | `/login`         | Log in and receive a JWT (1 hour)| No   | 200     | 400, 401      |
| GET    | `/kisiler`       | List all people                  | No   | 200     | -             |
| GET    | `/kisiler/:id`   | Get a single person by id        | No   | 200     | 404           |
| POST   | `/kisiler`       | Create a new person              | JWT  | 201     | 400, 401      |
| DELETE | `/kisiler/:id`   | Delete a person by id            | JWT  | 204     | 401, 404      |

Protected routes expect the header `Authorization: Bearer <token>`. A missing, invalid or expired token returns `401`.

### Example flow

Register a user:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "kutay@test.com", "password": "123456"}'
```

Log in to get a token:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "kutay@test.com", "password": "123456"}'
```

Response (`200 OK`):

```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

Create a person using the token:

```bash
curl -X POST http://localhost:3000/kisiler \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name": "Zeynep", "email": "zeynep@zeynep.com"}'
```

Response (`201 Created`):

```json
{ "id": 1, "name": "Zeynep", "email": "zeynep@zeynep.com" }
```

## What I Practiced

- Typing data with TypeScript interfaces and type-only imports
- Route parameters (`req.params`) and request bodies (`req.body`)
- HTTP status codes (200, 201, 204, 400, 401, 404, 409)
- Input validation and early returns
- Persisting data with SQLite and parameterized SQL queries (protection against SQL injection)
- Password hashing with bcrypt (passwords are never stored or returned in plain text)
- JWT authentication and an Express middleware that protects routes
- Keeping secrets out of the code with environment variables (`.env` is git-ignored)

## Notes

- Registration is open: anyone can create an account. A production version would restrict this (for example with roles or invitations).
- Login returns the same error message for an unknown email and a wrong password, so attackers cannot discover which emails are registered.

## Roadmap

- [x] Persist data with SQLite
- [x] Authentication with JWT
- [ ] Tests

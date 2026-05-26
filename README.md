# DevPulse – Internal Tech Issue & Feature Tracker

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Developer:** Fahim Faysal Nirjhar
**Live URL:** `https://dev-pulse-assignment-2-sandy.vercel.app/`
**GitHub:** `https://github.com/FahimFaysalNirjhar/DevPulse-Assignment-2`

---

## Features

- User registration and authentication with JWT
- Role-based access control (`contributor` and `maintainer`)
- Create, view, update, and delete issues (bugs & feature requests)
- Filter and sort issues by type, status, and date
- Secure password hashing with bcrypt
- Modular, clean TypeScript architecture

---

## Tech Stack

| Technology           | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| Node.js (LTS 24.x)   | Runtime environment                            |
| TypeScript           | Strongly-typed language layer                  |
| Express.js           | Web framework with modular router architecture |
| PostgreSQL           | Relational database                            |
| `pg` (native driver) | Direct database queries via `pool.query()`     |
| `bcrypt`             | Password hashing                               |
| `jsonwebtoken`       | JWT generation and verification                |
| `http-status-codes`  | Consistent HTTP status code references         |

---

## Getting Started

### Prerequisites

- Node.js LTS (24.x or higher)
- PostgreSQL database (local or cloud-hosted)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/FahimFaysalNirjhar/DevPulse-Assignment-2
cd devpulse

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Set up the database
psql -U your_user -d your_database -f schema.sql

# 5. Start the development server
npm run dev
```

### Environment Variables

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/devpulse
JWT_SECRET=your_jwt_secret_here
```

---

## Database Schema

### `users`

| Column       | Type                          | Description                                          |
| ------------ | ----------------------------- | ---------------------------------------------------- |
| `id`         | SERIAL PRIMARY KEY            | Auto-incrementing unique identifier                  |
| `name`       | VARCHAR NOT NULL              | Full display name                                    |
| `email`      | VARCHAR UNIQUE NOT NULL       | Login email address                                  |
| `password`   | VARCHAR NOT NULL              | Bcrypt-hashed password (never returned in responses) |
| `role`       | VARCHAR DEFAULT 'contributor' | Either `contributor` or `maintainer`                 |
| `created_at` | TIMESTAMP                     | Auto-generated on insert                             |
| `updated_at` | TIMESTAMP                     | Auto-refreshed on update                             |

### `issues`

| Column        | Type                   | Description                               |
| ------------- | ---------------------- | ----------------------------------------- |
| `id`          | SERIAL PRIMARY KEY     | Auto-incrementing unique identifier       |
| `title`       | VARCHAR(150) NOT NULL  | Short descriptive headline                |
| `description` | TEXT NOT NULL          | Detailed explanation (min 20 characters)  |
| `type`        | VARCHAR NOT NULL       | Either `bug` or `feature_request`         |
| `status`      | VARCHAR DEFAULT 'open' | One of: `open`, `in_progress`, `resolved` |
| `reporter_id` | INTEGER NOT NULL       | References the submitting user's ID       |
| `created_at`  | TIMESTAMP              | Auto-generated on insert                  |
| `updated_at`  | TIMESTAMP              | Auto-refreshed on update                  |

---

## API Endpoints

### Authentication

| Method | Endpoint           | Access | Description                          |
| ------ | ------------------ | ------ | ------------------------------------ |
| POST   | `/api/auth/signup` | Public | Register a new user account          |
| POST   | `/api/auth/login`  | Public | Authenticate and receive a JWT token |

### Issues

| Method | Endpoint          | Access          | Description                                   |
| ------ | ----------------- | --------------- | --------------------------------------------- |
| POST   | `/api/issues`     | Authenticated   | Create a new issue                            |
| GET    | `/api/issues`     | Public          | Get all issues (supports filtering & sorting) |
| GET    | `/api/issues/:id` | Public          | Get a single issue by ID                      |
| PATCH  | `/api/issues/:id` | Authenticated   | Update an issue                               |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue                               |

### Query Parameters for `GET /api/issues`

| Param    | Values                            | Default              |
| -------- | --------------------------------- | -------------------- |
| `sort`   | `newest`, `oldest`                | `newest`             |
| `type`   | `bug`, `feature_request`          | (none — returns all) |
| `status` | `open`, `in_progress`, `resolved` | (none — returns all) |

### Authorization Header Format

```
Authorization: <JWT_TOKEN>
```

---

## Request & Response Examples

### POST `/api/auth/signup`

**Request:**

```json
{
  "name": "Fahim Faysal Nirjhar",
  "email": "fahim@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Fahim Faysal Nirjhar",
    "email": "fahim@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

### POST `/api/issues`

**Request:**

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

## Project Structure

```
devpulse/
├── src/
│   ├── config/         # Database pool and environment config
│   ├── middleware/     # Auth middleware, error handler
│   ├── modules/
│   │   ├── auth/       # Auth routes, controller, service
│   │   └── issues/     # Issues routes, controller, service
│   ├── utils/          # Response helpers, validators
│   └── app.ts          # Express app setup
├── schema.sql          # Database schema
├── .env.example        # Environment variable template
├── tsconfig.json
└── package.json
```

---

## Role & Permission Summary

| Action                                 | Contributor | Maintainer |
| -------------------------------------- | ----------- | ---------- |
| Register / Login                       | ✅          | ✅         |
| Create issue                           | ✅          | ✅         |
| View all issues                        | ✅          | ✅         |
| Update own issue (status: `open` only) | ✅          | ✅         |
| Update any issue                       | ❌          | ✅         |
| Delete any issue                       | ❌          | ✅         |
| Change issue status independently      | ❌          | ✅         |

---

## Deployment

- **Backend:** Deployed on [Vercel](https://vercel.com)
- **Database:** Hosted on [NeonDB](https://neon.tech)
- CORS is configured for cross-origin access
- Environment variables are managed via the hosting platform's settings

---

## License

This project was built as an academic assignment. All code is original work by **Fahim Faysal Nirjhar**.

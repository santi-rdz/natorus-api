# Natours API

A REST API for tours built with Express 5 and MongoDB. Features layered
architecture (routes → controllers → services), schema validation with Zod, and
a centralized error-handling pipeline.

## Stack

| Concern     | Choice                    |
| ----------- | ------------------------- |
| Runtime     | Node.js ≥ 22 (ESM)        |
| Framework   | Express 5                 |
| Database    | MongoDB via Mongoose 9    |
| Validation  | Zod 4                     |
| Query parse | qs (nested query strings) |
| Tooling     | ESLint 10, Prettier 3     |

Node ≥ 22 is required for native `--env-file` and JSON import attributes.

## Getting started

```bash
pnpm install
cp .env.example .env      # fill in your values
pnpm dev
```

Server starts on `http://localhost:8000` (configurable via `PORT`).

### Environment

| Variable      | Description                                        |
| ------------- | ------------------------------------------------- |
| `NODE_ENV`    | `development` or `production`                      |
| `PORT`        | HTTP port (default `8000`)                         |
| `DB_URL`      | MongoDB connection string; `<PASSWORD>` is replaced with `DB_PASSWORD` at runtime |
| `DB_PASSWORD` | Database password                                 |

## Scripts

| Command            | Action                                            |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Run in watch mode with `.env`                     |
| `pnpm start`       | Run in production mode                            |
| `pnpm dev:data`    | Seed the database — append `--import` or `--delete` |
| `pnpm lint`        | Lint with ESLint                                  |
| `pnpm lint:format` | Lint and auto-fix                                 |
| `pnpm format`      | Format with Prettier                              |
| `pnpm check`       | Lint + verify formatting                          |

Seed example:

```bash
pnpm dev:data --import
pnpm dev:data --delete
```

## API

Base path: `/api/v1`

### Tours

| Method   | Endpoint               | Description                       |
| -------- | ---------------------- | --------------------------------- |
| `GET`    | `/tours`               | List tours (filter/sort/paginate) |
| `POST`   | `/tours`               | Create a tour                     |
| `GET`    | `/tours/:id`           | Get a tour by id                  |
| `PATCH`  | `/tours/:id`           | Update a tour                     |
| `DELETE` | `/tours/:id`           | Delete a tour                     |
| `GET`    | `/tours/stats`         | Aggregated stats by difficulty    |
| `GET`    | `/tours/monthly-plan/:year` | Tour count per month         |

### Users

| Method   | Endpoint     | Description        |
| -------- | ------------ | ------------------ |
| `GET`    | `/users`     | List users         |
| `POST`   | `/users`     | Create a user      |
| `GET`    | `/users/:id` | Get a user by id   |
| `PATCH`  | `/users/:id` | Update a user      |
| `DELETE` | `/users/:id` | Delete a user      |

### Query parameters (`GET /tours`)

| Param    | Example                       | Effect                          |
| -------- | ----------------------------- | ------------------------------- |
| filters  | `?difficulty=easy&price[gte]=500` | Field equality and `gte/gt/lte/lt` operators |
| `sort`   | `?sort=-price,ratingsAverage` | Sort by fields (default `-createdAt`) |
| `fields` | `?fields=name,price`          | Project specific fields         |
| `page`   | `?page=2`                     | Page number                     |
| `limit`  | `?limit=10`                   | Page size                       |

## Project structure

```
src/
├── app.js              # Express app: middleware, routes, error handlers
├── server.js           # Bootstrap: DB connection, listen, process guards
├── routes/             # Route definitions
├── controllers/        # HTTP layer — request/response only
├── services/           # Business logic and data access
├── models/             # Mongoose schemas
├── schemas/            # Zod validation schemas
├── middlewares/        # validate, notFound, errorHandler
├── errors/             # AppError hierarchy
├── lib/                # Query builder and utilities
└── public/             # Static assets
```

Responsibilities are split by layer: controllers own the HTTP boundary,
services own business logic, models own persistence. Domain validation lives in
Zod schemas at the API edge; Mongoose models own persistence constraints only.

## Error handling

All errors funnel through a single global handler with a consistent response
envelope:

```jsonc
{ "status": "fail", "code": "NOT_FOUND", "message": "Tour not found" }
```

See [docs/error-handling.md](docs/error-handling.md) for the full architecture.

## License

ISC

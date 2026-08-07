# Error Handling

All errors flow through a single global handler. Application code throws typed
errors; one place owns status codes, response shape, and logging.

## Contract

Every error returns the same envelope:

```jsonc
{
  "status": "fail",              // "fail" for 4xx, "error" for 5xx
  "code": "NOT_FOUND",           // stable, machine-readable
  "message": "Tour not found",
  "errors": []                   // optional, field-level details
}
```

| Status | `code`             | When                          |
| ------ | ------------------ | ----------------------------- |
| 400    | `VALIDATION_ERROR` | Invalid body/query (Zod)      |
| 400    | `INVALID_FORMAT`   | Malformed identifier          |
| 404    | `NOT_FOUND`        | Resource or route missing     |
| 409    | `CONFLICT`         | Unique constraint violation   |
| 500    | `INTERNAL_ERROR`   | Unexpected — masked in prod    |

## Flow

```
Request
  │  normal chain  (req, res, next)
  ├─ parsers · logging · route handlers
  │     success → res.json()
  │     failure → throw / next(err) ──┐
  └─ no match → notFound() ───────────┤
                                      ▼  error chain  (err, req, res, next)
                              errorHandler
                                normalize → classify → respond
```

Express dispatches by handler arity: 3-arg middleware form the **normal chain**,
4-arg middleware the **error chain**. `next(err)` switches chains, skipping the
remainder of the normal chain. `notFound` therefore runs only when a request
exhausts the normal chain unhandled; any thrown error bypasses it.

## Components

### Typed errors — `src/errors/AppError.js`

```js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
```

`isOperational` marks expected failures. Non-`AppError` throws (bugs, library
faults) lack it and are reported as `500`. Subclasses (`NotFoundError`,
`ValidationError`, `ConflictError`, `UnauthorizedError`) fix `statusCode` and
`code`.

### Raising errors

Services and middleware throw; they never touch `res`.

```js
if (!tour) throw new NotFoundError('Tour')
if (result.error) return next(new ValidationError('Validation Error', details))
```

Express 5 forwards rejected promises from `async` handlers automatically — no
wrapper required.

### Global handler — `src/middlewares/errorHandler.js`

Normalizes framework errors (Mongoose `CastError`, `ValidationError`, duplicate
key `11000`) into `AppError`, then serializes the response. Non-operational
errors are logged in full and masked in production.

### Registration — `src/app.js`

```js
app.use(notFound)      // last of the normal chain
app.use(errorHandler)  // terminus of the error chain
```

### Process safety net — `src/server.js`

```js
process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exitCode = 1
  server.close()
})
```

## Adapting this pattern

1. Base `AppError` (`statusCode`, `code`, `isOperational`) with domain subclasses.
2. Throw from application code; never respond there.
3. A not-found fallback after all routes.
4. One error handler, registered last, that normalizes and serializes.
5. Process-level `unhandledRejection` / `uncaughtException` guards.
6. Mask non-operational errors in production.

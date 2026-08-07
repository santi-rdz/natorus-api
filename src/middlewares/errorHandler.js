import { AppError, ConflictError, ValidationError } from '../errors/AppError.js'

function normalizeError(err) {
  if (err.name === 'CastError') {
    return new ValidationError(
      `Invalid ${err.path}: ${err.value}`,
      undefined,
      'INVALID_FORMAT',
    )
  }
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return new ValidationError('Invalid input data', details)
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field'
    return new ConflictError(field)
  }
  return err
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  err = normalizeError(err)

  const isOperational = err instanceof AppError && err.isOperational
  const statusCode = isOperational ? err.statusCode : 500
  const status = statusCode >= 500 ? 'error' : 'fail'

  if (!isOperational) console.error('UNEXPECTED ERROR', err)

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status,
      code: err.code,
      message: err.message,
      ...(err.details && { errors: err.details }),
      stack: err.stack,
    })
  }
  return res.status(statusCode).json({
    status,
    code: isOperational ? err.code : 'INTERNAL_ERROR',
    message: isOperational ? err.message : 'Something went wrong',
    ...(isOperational && err.details && { errors: err.details }),
  })
}

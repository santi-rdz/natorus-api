import { ValidationError } from '../errors/AppError.js'
import { ObjectId } from '../schemas/fields.js'

export function validate(validateFn, source = 'body') {
  return (req, _res, next) => {
    const result = validateFn(req[source])
    if (result.error) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }))
      return next(new ValidationError('Validation Error', details))
    }
    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
    })
    next()
  }
}

export function validateObjectId(param = 'id') {
  return (req, _res, next) => {
    const result = ObjectId.safeParse(req.params[param])
    if (result.error)
      return next(
        new ValidationError('Invalid ID format', undefined, 'INVALID_FORMAT'),
      )

    next()
  }
}

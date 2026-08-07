export const commaToSpace = (query) => query?.split(',').join(' ')
export const toMongoOps = (filters = {}) =>
  JSON.parse(JSON.stringify(filters).replace(/\b(gte|gt|lte|lt)\b/g, '$$$1'))

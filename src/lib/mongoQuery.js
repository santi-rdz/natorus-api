import { commaToSpace, toMongoOps } from './utils.js'

export class QueryFeatures {
  constructor(query, options = {}) {
    this.query = query
    this.options = options
  }
  filter() {
    const { page, limit, sort, fields, ...filters } = this.options
    this.query = this.query.find(toMongoOps(filters))
    return this
  }
  sort() {
    this.query = this.query.sort(
      commaToSpace(this.options.sort) || '-createdAt',
    )
    return this
  }
  select() {
    this.query = this.query.select(commaToSpace(this.options.fields) || '-__v')
    return this
  }
  paginate() {
    const { page, limit } = this.options
    this.query = this.query.skip((page - 1) * limit).limit(limit)
    return this
  }
}

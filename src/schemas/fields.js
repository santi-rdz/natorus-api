import z from 'zod'

const numericField = (integer, message) => {
  const base = z.coerce.number({ error: message ?? 'Must be a valid number' })
  return integer ? base.int('Must be an integer') : base
}

export const num = (message) => numericField(false, message)
export const int = (message) => numericField(true, message)
export const str = (message) => z.string({ error: message }).trim()
export const ObjectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Id')

export const numericFilter = z
  .union([
    z.coerce.number(),
    z.object({
      gte: z.coerce.number().optional(),
      gt: z.coerce.number().optional(),
      lte: z.coerce.number().optional(),
      lt: z.coerce.number().optional(),
    }),
  ])
  .optional()

export const baseQuery = z.object({
  sort: str().optional(),
  page: int().min(1).default(1),
  limit: int().max(100).default(10),
})

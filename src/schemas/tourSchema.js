import z from 'zod'
import { baseQuery, num, numericFilter, str } from './fields.js'
import {
  DEFAULTS,
  DIFFICULTIES,
  DURATION,
  NAME,
  RATING,
} from './tourConstants.js'

export const tourSchema = z
  .object({
    name: str('A tour must have a name')
      .regex(/^[\p{L} ]+$/u, 'Only letters are allowed')
      .min(NAME.min)
      .max(NAME.max),
    duration: num('Enter a valid duration').max(DURATION.max),
    maxGroupSize: num('Enter a valid max group size'),
    difficulty: z.enum(DIFFICULTIES, {
      error: 'Difficulty must be easy, medium or difficult',
    }),
    ratingsAverage: num()
      .min(RATING.min)
      .max(RATING.max)
      .default(DEFAULTS.ratingsAverage),
    ratingsQuantity: num().default(DEFAULTS.ratingsQuantity),
    rating: num().default(DEFAULTS.rating),
    price: num('Enter a valid price'),
    priceDiscount: num().nullish(),
    summary: str('A tour must have a summary'),
    description: str().optional(),
    imageCover: str('A tour must have a cover image'),
    images: z.array(z.string()).optional(),
    startDates: z.array(z.coerce.date()).optional(),
    secretTour: z.boolean().default(DEFAULTS.secretTour),
  })
  .superRefine((data, ctx) => {
    if (data.priceDiscount != null && data.priceDiscount > data.price) {
      ctx.addIssue({
        code: 'custom',
        message: `Price Discount must less or equal than ${data.price}`,
        path: ['priceDiscount'],
      })
    }
  })

export const tourQuerySchema = z.object({
  ...baseQuery.shape,
  difficulty: z.enum(DIFFICULTIES).optional(),
  price: numericFilter,
  duration: numericFilter,
  ratingsAverage: numericFilter,
  fields: str().optional(),
})

export const validateTour = (input) => tourSchema.safeParse(input)
export const validatePartialTour = (input) =>
  tourSchema.partial().safeParse(input)
export const validateTourQuery = (input) => tourQuerySchema.safeParse(input)

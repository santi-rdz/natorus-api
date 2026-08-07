// Single source of truth for tour domain values shared by the Zod schema
// (validation at the API boundary) and the Mongoose model (persistence).

export const DIFFICULTIES = ['easy', 'medium', 'difficult']

export const NAME = { min: 5, max: 40 }
export const RATING = { min: 1, max: 5 }
export const DURATION = { max: 100 }

export const DEFAULTS = {
  ratingsAverage: 4.5,
  ratingsQuantity: 0,
  rating: 4.5,
  secretTour: false,
}

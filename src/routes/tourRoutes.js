import { Router } from 'express'
import { TourController } from '../controllers/tourController.js'
import { validate, validateObjectId } from '../middlewares/validate.js'
import {
  validatePartialTour,
  validateTourQuery,
  validateTour,
} from '../schemas/tourSchema.js'

export const tourRouter = Router()

tourRouter
  .route('/')
  .get(validate(validateTourQuery, 'query'), TourController.getAll)
  .post(validate(validateTour), TourController.create)

tourRouter.get('/stats', TourController.tourStats)
tourRouter.get('/monthly-plan/:year', TourController.monthlyPlan)

tourRouter
  .route('/:id')
  .all(validateObjectId())
  .get(TourController.getById)
  .patch(validate(validatePartialTour), TourController.update)
  .delete(TourController.delete)

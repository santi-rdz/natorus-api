import { Router } from 'express'
import { userController } from '../controllers/userController.js'

export const userRouter = Router()

userRouter.route('/').get(userController.getAll).post(userController.create)

userRouter
  .route('/:id')
  .get(userController.getById)
  .patch(userController.update)
  .delete(userController.delete)

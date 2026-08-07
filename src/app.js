import express from 'express'
import qs from 'qs'
import path from 'node:path'
import morgan from 'morgan'
import { tourRouter } from './routes/tourRoutes.js'
import { userRouter } from './routes/userRoutes.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const app = express()
app.set('query parser', (str) => qs.parse(str))

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(import.meta.dirname, 'public')))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// APP Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Errors
app.use(notFound)
app.use(errorHandler)

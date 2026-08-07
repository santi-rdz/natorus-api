import { app } from './app.js'
import mongoose from 'mongoose'

const databseURL = process.env.DB_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
)

mongoose.connect(databseURL).then(() => {
  console.log('Connection to mongodb successful')
})

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION Shutting down...', {
    name: err.name,
    message: err.message,
  })
  process.exitCode = 1
  server.close()
})

process.on('uncaughtException', (err) => {
  console.error({
    name: err.name,
    message: err.message,
  })
  process.exitCode = 1
  server.close()
})

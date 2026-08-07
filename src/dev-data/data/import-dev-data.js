import mongoose from 'mongoose'
import tours from './tours-simple.json' with { type: 'json' }
import { Tour } from '../../models/TourModel.js'

const databseURL = process.env.DB_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
)

mongoose.connect(databseURL).then(() => {
  console.log('Connection to mongodb successful')
})

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data succesfully loadaed!')
    process.exit()
  } catch (error) {
    console.log(`error importing data: ${error}`)
  }
}

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data succesfully deleted!')
    process.exit()
  } catch (error) {
    console.log(`error deleting data: ${error}`)
  }
}
console.log(process.argv)
if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

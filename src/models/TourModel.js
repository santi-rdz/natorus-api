import mongoose from 'mongoose'
import slugify from 'slugify'
import { DEFAULTS, DIFFICULTIES } from '../schemas/tourConstants.js'

// Business/domain validation (min/max/enum/required messages) lives in the Zod
// schema and runs at the API boundary. This model only owns persistence
// concerns: types, DB constraints (unique/index), and defaults.
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTIES,
    },
    ratingsAverage: {
      type: Number,
      default: DEFAULTS.ratingsAverage,
    },
    ratingsQuantity: {
      type: Number,
      default: DEFAULTS.ratingsQuantity,
    },
    rating: {
      type: Number,
      default: DEFAULTS.rating,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      select: false,
    },
    updatedAt: {
      type: Date,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: DEFAULTS.secretTour,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// tourSchema.pre('save', async function () {
//   console.log('Will save document')
// })

//* Document middleware
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true, strict: true })
  console.log(this.slug)
})

//* Qury middleware
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
})

// tourSchema.post(/^find/, function (docs) {
//   console.log(docs)
//   console.log(`Query took ${Date.now() - this.start}ms`)
// })

//* Aggregation Middlewares
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})

export const Tour = mongoose.model('Tour', tourSchema)

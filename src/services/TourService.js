import { NotFoundError } from '../errors/AppError.js'
import { QueryFeatures } from '../lib/mongoQuery.js'
import { commaToSpace } from '../lib/utils.js'
import { Tour } from '../models/TourModel.js'

export class TourService {
  static async getAll(options) {
    const features = new QueryFeatures(Tour.find(), options)
      .filter()
      .sort()
      .select()
      .paginate()
    const filter = features.query.getFilter()
    const [tours, total] = await Promise.all([
      features.query,
      Tour.countDocuments(filter),
    ])
    return { tours, total }
  }
  static async getById(id, fields) {
    const tour = await Tour.findById(id).select(commaToSpace(fields) || '-__v')
    if (!tour) {
      throw new NotFoundError('Tour')
    }
    return tour
  }
  static async create(data) {
    const newTour = await Tour.create(data)
    return newTour
  }
  static async update(id, data) {
    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
    if (!tour) {
      throw new NotFoundError('Tour')
    }
    return tour
  }
  static async delete(id) {
    const tour = await Tour.findByIdAndDelete(id)
    if (!tour) {
      throw new NotFoundError('Tour')
    }
    return tour
  }
  static async tourStats() {
    const stats = Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ])
    return stats
  }
  static async monthlyPlan({ year }) {
    const plan = Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numToursStarts: -1 },
      },
      {
        $limit: 12,
      },
    ])
    return plan
  }
}

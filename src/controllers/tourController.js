import { TourService } from '../services/TourService.js'

export class TourController {
  static async getAll(req, res) {
    const { page, limit } = req.query
    const { tours, total } = await TourService.getAll(req.query)
    return res.json({
      status: 'success',
      data: {
        tours,
      },
      count: tours.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  }
  static async getById(req, res) {
    const { id } = req.params
    const tour = await TourService.getById(id, req.query.fields)
    return res.json({
      status: 'success',
      data: {
        tour,
      },
    })
  }
  static async create(req, res) {
    const tour = await TourService.create(req.body)
    return res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    })
  }
  static async update(req, res) {
    const {
      params: { id },
      body,
    } = req
    const tour = await TourService.update(id, body)
    return res.json({ status: 'success', data: { tour } })
  }
  static async delete(req, res) {
    const { id } = req.params
    const tour = await TourService.delete(id)
    return res.json({
      status: 'success',
      data: {
        tour,
      },
    })
  }
  static async tourStats(req, res) {
    const stats = await TourService.tourStats()
    return res.json({
      status: 'success',
      data: {
        stats,
      },
    })
  }
  static async monthlyPlan(req, res) {
    const plan = await TourService.monthlyPlan(req.params)
    return res.json({
      status: 'success',
      data: {
        plan,
      },
    })
  }
}

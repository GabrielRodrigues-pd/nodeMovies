const AppError = require('../utils/AppError')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Missing required fields', 400)
    }

    return res.json({ name, email, password })
  }
}

module.exports = UsersController

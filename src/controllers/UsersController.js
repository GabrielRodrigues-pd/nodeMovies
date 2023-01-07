const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash } = require('bcryptjs')
class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Missing required fields', 400)
    }
    // tirando espaços do email
    const Email = email.trim()

    const checkUsersExists = await knex('users').where({ email: Email }).first()

    if (checkUsersExists) {
      throw new AppError('Usuário ja cadastrado', 400)
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      name,
      email: Email,
      password: hashedPassword
    })

    return res.status(201).json()
  }
}

module.exports = UsersController

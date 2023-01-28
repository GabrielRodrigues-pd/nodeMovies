const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')
class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Missing required fields', 400)
    }
    // tirando espaços do email
    const Email = email.trim()

    if (!Email.includes('@')) {
      throw new AppError('Insira um email válido.', 400)
    }

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

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const id = req.user.id

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso')
    }

    if (!email.includes('@')) {
      throw new AppError('Insira um email válido.', 400)
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        'Você precisa informar a senha antiga para definir a nova senha'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    await knex('users')
      .update({
        name,
        email,
        password: user.password
      })
      .where({ id })

    return res.status(201).json()
  }
}

module.exports = UsersController

const knex = require('../database/knex')

class MoviesController {
  async create(req, res) {
    const { title, description, tags, rating } = req.body
    const user_id = req.user.id

    // inserindo moveis e recuperando o id
    const movies_id = await knex('movies').insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        movies_id,
        user_id,
        name
      }
    })

    await knex('tags').insert(tagsInsert)

    return res.status(201).json()
  }

  async show(req, res) {
    const { id } = req.params

    const movie = await knex('movies').where({ id }).first()

    const tags = await knex('tags').where({ movies_id: id }).orderBy('name')

    return res.json({
      ...movie,
      tags
    })
  }

  async delete(req, res) {
    const user_id = req.user.id

    await knex('movies').where({ user_id }).delete()

    return res.status(201).json()
  }

  async index(req, res) {}
}

module.exports = MoviesController

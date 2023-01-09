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

  async show(req, res) {}

  async delete(req, res) {}

  async index(req, res) {}
}

module.exports = MoviesController

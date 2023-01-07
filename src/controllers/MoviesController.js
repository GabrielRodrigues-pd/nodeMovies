const knex = require('../database/knex')

class MoviesController {
  async create(req, res) {
    const { title, description, tags, rating } = req.body
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    const movie_id = await knex('movies').insert({
      title,
      description,
      rating,
      user_id: user.id
    })

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        id,
        name
      }
    })

    await knex('tags').insert(tagsInsert)

    return res.status(201).json()
  }
}

module.exports = MoviesController

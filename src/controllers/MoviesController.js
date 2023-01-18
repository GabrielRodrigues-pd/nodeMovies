const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MoviesController {
  async create(req, res) {
    const { title, description, tags, rating } = req.body
    const user_id = req.user.id

    const movieExist = await knex('movies')
      .where({ user_id })
      .where({ title })
      .first()

    if (movieExist) {
      throw new AppError('Filme já existe')
    }

    // inserindo moveis e recuperando o id
    const movie_id = await knex('movies').insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        user_id,
        name
      }
    })

    if (tagsInsert.length > 0) {
      await knex('tags').insert(tagsInsert)
    }

    return res.status(201).json()
  }

  async show(req, res) {
    const { id } = req.params

    const movie = await knex('movies').where({ id }).first()

    const tags = await knex('tags').where({ movie_id: id }).orderBy('name')

    return res.json({
      ...movie,
      tags
    })
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('movies').where({ id }).delete()

    return res.status(201).json()
  }

  async index(req, res) {
    const { title, tags } = req.query

    const user_id = req.user.id

    let movies

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      movies = await knex('tags')
        .select(['movies.id', 'movies.title', 'movies.user_id'])
        .where('movies.user_id', user_id)
        .whereLike('movies.title', `%${title}%`)
        .whereIn('name', filterTags)
        .innerJoin('movies', 'movies.id', 'tags.movie_id')
        .orderBy('movies.title')
    } else {
      movies = await knex('movies')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')

      if (movies.length <= 0) {
        movies = await knex('tags')
          .where('movies.user_id', user_id)
          .whereIn('name', [title])
          .innerJoin('movies', 'movies.id', 'tags.movie_id')
          .orderBy('movies.title')
      }
    }

    const userTags = await knex('tags').where({ user_id })
    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id)

      return {
        ...movie,
        tags: movieTags
      }
    })

    return res.json(moviesWithTags)
  }
}

module.exports = MoviesController

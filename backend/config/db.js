const { DB } = require('../.env')
const knex = require('knex')(DB)

module.exports = knex
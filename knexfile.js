const {db} = require('./env')

module.exports = {
  client: 'postgresql',
  connection: db,
  migrations: {
    tableName: 'knex_migrations'
  }
}

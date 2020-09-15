const knex = require('knex');
const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} = require('./config');

const database = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
  },
  pool: {
    max: 20,
    min: 5,
  },
});

(async () => {
  await database.raw('SELECT 1');
})();

module.exports = database;

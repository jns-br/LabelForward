const keys = require('../keys');
const statements = require('./statements');
const TextRepository = require('./TextRepository');
const { Pool } = require('pg');

class TimestampRepository {
  constructor() {
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
    });
  }
}

module.exports = new TextRepository();
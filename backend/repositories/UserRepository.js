const keys = require('../keys');
const { Pool } = require('pg');

class UserRepository {
  constructor() {
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
    });
  }

  async findUserById(id) {
    try {
      const statement = `SELECT user_id FROM users WHERE user_id = ${id}`;
      const result = await this.pgClient.query(statement);
      return result.rowCount === 1;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new UserRepository();
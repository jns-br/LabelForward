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
      const statement = `SELECT * FROM users WHERE user_id = ${id}`;
      const result = await this.pgClient.query(statement);
      if (result.rowCount !== 1) {
        return null;
      }
      return result.rows[0];
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async findUserByEmail(email) {
    try {
      const statement = `SELECT * FROM users WHERE email = ${email}`;
      const result = await this.pgClient.query(statement);
      if(result.rowCount !== 1) {
        return null;
      }
      return result.rows[0];
    } catch (err) {
      console.error('DB error', err);
      throw err;
    }
  }
}

module.exports = new UserRepository();
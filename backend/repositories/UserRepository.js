const keys = require('../keys');
const UserService = require('../services/UserService');
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

  async createUser(email, password) {
    try {
      const statementAccess = `SELECT * FROM accessors WHERE email = ${email}`;
      const result = await this.pgClient.query(statementAccess);
      if (result.rowCount !== 1) {
        return false;
      }
      
      const hashedPassword = await UserService.hashPassword(password);
      const statementInsert = `INSERT INTO users(user_name, email, password) VALUES (${email}, ${email}, ${hashedPassword})`;
      await this.pgClient.query(statementInsert);

      const statementDelete = `DELETE FROM accessors WHERE email = ${email}`;
      await this.pgClient.query(statementDelete);

      return true;
    } catch (err) {
      
    }
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
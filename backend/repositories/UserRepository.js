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
      const statementAccess = "SELECT * FROM accessors WHERE email = $1";
      const result = await this.pgClient.query(statementAccess, [email]);
      if (result.rowCount !== 1) {
        return false;
      }
      
      const hashedPassword = await UserService.hashPassword(password);
      const statementInsert = "INSERT INTO users(email, password) VALUES ($1, $2)";
      await this.pgClient.query(statementInsert, [email, hashedPassword]);

      const statementDelete = "DELETE FROM accessors WHERE email = $1";
      await this.pgClient.query(statementDelete, [email]);

      return true;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async findUserById(id) {
    try {
      const statement = "SELECT * FROM users WHERE user_id = $1";
      const result = await this.pgClient.query(statement, [id]);
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
      const statement = "SELECT * FROM users WHERE email = $1";
      const result = await this.pgClient.query(statement, [email]);
      if(result.rowCount !== 1) {
        return null;
      }
      return result.rows[0];
    } catch (err) {
      console.error('DB error', err);
      throw err;
    }
  }

  async updateEmail(oldEmail, newEmail, password) {
    try {
      const user = await this.findUserByEmail(oldEmail);
      if (user) {
        const isMatch = await UserService.compareHashed(password, user.password);
        if(!isMatch) {
          return false;
        }

        const statement = "UPDATE users SET email = $1 WHERE user_id = $2";
        await this.pgClient.query(statement, [newEmail, user.user_id]);
        return true;
      } else {
        return false;
      }

    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async updatePassword(email, oldPassword, newPassword) {
    try {
      const user = await this.findUserByEmail(email);
      if(user) {
        const isMatch = await UserService.compareHashed(oldPassword, user.password);
        if(!isMatch) {
          return false;
        }

        const statement = "UPDATE users SET password = $1 WHERE user_id = $2";
        const hashedNew = await UserService.hashPassword(newPassword);
        await this.pgClient.query(statement, [hashedNew, user.user_id]);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new UserRepository();
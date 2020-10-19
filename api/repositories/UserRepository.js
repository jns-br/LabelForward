const keys = require('../keys');
const statements = require('./statements');
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
      const statementAccess = statements.selectAccesor;
      const result = await this.pgClient.query(statementAccess, [email]);
      if (result.rowCount !== 1) {
        return false;
      }
      
      const hashedPassword = await UserService.hashPassword(password);
      const statementInsert = statements.insertUser;
      await this.pgClient.query(statementInsert, [email, hashedPassword]);

      const statementDelete = statements.deleteAccessor;
      await this.pgClient.query(statementDelete, [email]);

      return true;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async findUserById(id) {
    try {
      const statement = statements.selectUserById;
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
      const statement = statements.selectUserByEmail;
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

  async updateEmail(id, newEmail, password) {
    try {
      const user = await this.findUserById(id);
      if (user) {
        const isMatch = await UserService.compareHashed(password, user.password);
        if(!isMatch) {
          return false;
        }

        const statement = statements.updateUserEmail;
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

  async updatePassword(id, oldPassword, newPassword) {
    try {
      const user = await this.findUserById(id);
      if(user) {
        const isMatch = await UserService.compareHashed(oldPassword, user.password);
        if(!isMatch) {
          return false;
        }

        const statement = statements.updateUserPassword;
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
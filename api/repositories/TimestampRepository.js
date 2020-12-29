const keys = require('../keys');
const statements = require('./statements');
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

  async insertStartTime (email, textId) {
    try {
      const statementUser = statements.selectUserByEmail;
      const resultUser = await this.pgClient.query(statementUser, [email]);
      const userId = parseInt(resultUser.rows[0].user_id);

      const date = Date.now() / 1000;
      const statmentInsert = statements.inserTimestamp;
      await this.pgClient.query(statmentInsert, [date, textId, userId]);
    } catch (err) {
      console.error('DB err', err.message);
      throw err;
    }
  }
}

module.exports = new TextRepository();
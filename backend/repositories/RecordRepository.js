const keys = require('../keys');
const { Pool } = require('pg');

class RecordRepository {
  constructor() {
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
    });
  }

  async insertEndIndex(end) {
    try {
      const statment = "INSERT INTO result_indices(end_index) VALUES($1)";
      const result = await this.pgClient.query(statment, [end]);
      if(result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      return result;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new RecordRepository();
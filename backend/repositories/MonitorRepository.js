const keys = require('../keys');
const { Pool } = require('pg');

class MonitorRepository {
  constructor () {
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
    });
  }

  async getClfData() {
    try {
      const statement = "SELECT clf_id, precision_score, created_at FROM classifiers";
      const result = await this.pgClient.query(statement);
      clfData = result.rows.map(val => {
        const data = {
          clfId : val.clf_id,
          precision : val.precision_score,
          timestampe : val.created_at
        }
        return data;
      });
      return clfData;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}
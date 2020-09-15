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
        return {
          clfId : val.clf_id,
          precision : val.precision_score,
          timestamp : val.created_at
        }
      });
      return clfData;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getLabelShare() {
    try {
      const countStatment = "SELECT COUNT(*) AS cnt FROM data WHERE labeled = true";
      const countResult = await this.pgClient.query(countStatment);
      const labelCount = countResult.rows[0].cnt;

      const totalStatement = "SELECT COUNT(*) AS cnt FROM data";
      const totalResult = await this.pgClient.query(totalStatement);
      const totalCount = totalResult.rows[0].cnt;

      return labelCount / totalCount;
    } catch (err) {
      
    }
  }
}

module.exports = new MonitorRepository();
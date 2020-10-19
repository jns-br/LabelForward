const keys = require('../keys');
const { Pool } = require('pg');
const fs = require('fs/promises');

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
      const statement = "SELECT clf_id, precision_score, created_at, download FROM classifiers";
      const result = await this.pgClient.query(statement);
      const clfData = result.rows.map(val => {
        return {
          clfId : val.clf_id,
          precision : val.precision_score,
          timestamp : val.created_at,
          download : val.download
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
      const countStatment = "SELECT COUNT(*) AS cnt FROM text_data WHERE major_label IS NOT NULL";
      const countResult = await this.pgClient.query(countStatment);
      const labelCount = countResult.rows[0].cnt;

      const totalStatement = "SELECT COUNT(*) AS cnt FROM text_data";
      const totalResult = await this.pgClient.query(totalStatement);
      const totalCount = totalResult.rows[0].cnt;

      return labelCount / totalCount;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async create_zip(clfId) {
    try {
      console.log('Creating zip');
      await fs.mkdir('/app/data/', {recursive: true});
      const statement = "SELECT file FROM downloads WHERE clf_id = $1";
      const res = await this.pgClient.query(statement, [clfId]);
      const filePath = '/app/data/data-' + clfId + '.zip';
      await fs.writeFile(filePath, res.rows[0].file);
      console.log('zip created');
      return filePath;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new MonitorRepository();
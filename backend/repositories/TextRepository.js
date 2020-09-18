const keys = require('../keys');
const Redis = require('ioredis');
const { Pool } = require('pg');

class TextRepository {
  constructor() {
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
    });
    this.redisClient = new Redis({
      port: keys.redisPort,
      host: keys.redisHost
    });
  }

  async getNextText(email) {
    try {
      const queryFlag = await this.redisClient.get('queryFlag');
      switch (queryFlag) {
        case 'available':
          const statement = "SELECT text_id, text_data FROM text_data WHERE NOT ($1 = ANY (users)) ORDER BY uncertainty ASC LIMIT 1";
          const result = await this.pgClient.query(statement, [email]);
          return result.rows[0];
        default:
          return null;
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertLabeledText(label, email, text_id) {
    try {
      const statment = "UPDATE text_data SET labels = array_append(labels, $1), users = array_append(users, $2) WHERE text_id = $3";
      const result = await this.pgClient.query(statment, [label, email, text_id]);
      if(result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      const queryCounter = parseInt(await this.redisClient.get('queryCounter'));
      await this.redisClient.set('queryCounter', (queryCounter + 1));
      if ((queryCounter + 1) >= parseInt(keys.batchSize)) {
        const pub = this.redisClient.duplicate();
        await pub.publish('learner', 'update');
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getLabels() {
    try {
      const statement = "SELECT label FROM labels";
      const results = await this.pgClient.query(statement);
      return Array.from(results.rows, result => result.label);
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new TextRepository();
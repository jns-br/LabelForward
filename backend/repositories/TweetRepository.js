const keys = require('../keys');
const Redis = require('ioredis');
const { Pool } = require('pg');

class TweetRepository {
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

  async getNextTweet(email) {
    try {
      const queryFlag = await this.redisClient.get('queryFlag');
      switch (queryFlag) {
        case 'available':
          const statement = "SELECT tweet_id, tweet FROM queries WHERE NOT ($1 = ANY (users)) ORDER BY (array_length(users, 1)) DESC LIMIT 1";
          const result = await this.pgClient.query(statement, [email]);
          return result.rows[0];
        case 'unavailable':
          return null;
        default:
          await this.redisClient.set('queryFlag', 'unavailable');
          const pub = this.redisClient.duplicate();
          await pub.publish('predictor', 'init');
          return null;
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertLabeledTweet(label, email, tweet_id) {
    try {
      const statement = "UPDATE queries SET labels = array_append(labels, $1), users = array_append(users, $2) WHERE tweet_id = $3";
      const result = await this.pgClient.query(statement, [label, email, tweet_id]);
      if (result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      const isFull = await this.isQueryTableFull();
      if (isFull) {
        await this.redisClient.set('queryflag', 'unavailable');
        const pub = this.redisClient.duplicate();
        await pub.publish('learner', 'update');
      }
      return result;

    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getLabels() {
    try {
      const statement = "SELECT DISTINCT category FROM tweets";
      const results = await this.pgClient.query(statement);
      return Array.from(results.rows, result => result.category);
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async isQueryTableFull() {
    try {
      const statement = "SELECT COUNT(*) AS cnt FROM queries WHERE array_length(labels) >= $1";
      const result = await this.pgClient.query(statement, [keys.minLabelCount]);
      const count = parseInt(result.rows[0].cnt);
      if (count / parseInt(keys.setSize) >= parseInt(keys.queryThreshold)) {
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

module.exports = new TweetRepository();
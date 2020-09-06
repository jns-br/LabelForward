const keys = require('../keys');
const Redis = require('ioredis');
const RecordRepository = require('./RecordRepository');
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
      const queryFlag = await this.redisClient.get('queryflag');
      switch (queryFlag) {
        case 'available':
          const statement = "SELECT tweet FROM queries WHERE NOT ($1 = ANY (users)) ORDER BY (array_length(users, 1)) DESC LIMIT 1";
          const result = await this.pgClient.query(statement, [email]);
          return result;
        case 'unavailable':
          return null;
        default:
          await this.redisClient.set('queryflag', 'unavailable');
          const pub = this.redisClient.duplicate();
          await pub.publish('predictor', 'init');
          return null;
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertLabeledTweet(tweet, label, email) {
    try {
      const statement = "UPDATE queries SET labels = array_cat(labels, {$1}), users = array_cat(users, {$2}) WHERE tweet = $3";
      const result = await this.pgClient.query(statement, [label, email, tweet]);
      if (result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      const isFull = await this.isQueryTableFull();
      if (isFull) {
        await this.redisClient.set('queryflag', 'unavailable');
        const indexStatement = "SELECT query_id AS qid FROM queries ORDER BY query_id DESC LIMIT 1";
        const indexQuery = await this.pgClient.query(indexStatement);
        const endIndex = indexQuery.rows[0].qid;
        await RecordRepository.insertEndIndex(endIndex);
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
      const statement = "SELECT DISTINCT category FROM news";
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
      if (count / keys.setSize >= keys.queryThreshold) {
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
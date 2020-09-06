const keys = require('../keys');
const redis = require('redis');
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
    this.redisClient = redis.createClient({
      host: keys.redisHost,
      port: keys.redisPort,
      retry_strategy: () => 1000
    });
  }

  async getNextTweet(index) {
    try {
      const statment = `SELECT headline, category, description FROM news WHERE news_id = ${index}`;
      const result = await this.pgClient.query(statment);
      const response = result.rows[0].headline + ": " + result.rows[0].description
      return response;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getNextTweetNew(email) {
    try {
      this.redisClient.get('queryflag', async(err, queryFlag) => {
        if (err) {
          console.log('Redis error', err.message);
          throw err;
        }

        switch (queryFlag) {
          case 'available':
            const statement = "SELECT tweet FROM queries WHERE NOT ($1 = ANY (users)) ORDER BY (array_length(users, 1)) DESC";
            const result = await this.pgClient.query(statement, [email]);
            return result;
          case 'unavailable':
            return null;
          default:
            this.redisClient.set('queryflag', 'unavailable', (err, reply) => {
              this.redisClient.publish('predictor', 'update');
            });
            return null;
        }
      });
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertLabeledTweet(tweet, label) {
    try {
      const statement = "INSERT INTO results(news, label) VALUES($1, $2)";
      const result = await this.pgClient.query(statement, [tweet, label]);
      if (result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      return result;
    } catch (err) {
      console.error('DB error', err.message);
      throw message;
    }
  }

  async insertLabeledTweetNew(tweet, label, email) {
    try {
      const statement = "UPDATE queries SET labels = array_cat(labels, {$1}), users = array_cat(users, {$2} WHERE tweet = $3";
      const result = await this.pgClient.query(statement, [label, email, tweet]);
      if (result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      const isFull = await this.isQueryTableFull();
      if (isFull) {
        this.redisClient.set('queryflag', 'unavailable', (setRrr, setReply) => {
          this.redisClient.publish('predictor', 'update', (pubErr, pubReply) => {
            return result;
          })
        })
      } else {
        return result;
      }
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
      const statement = "SELECT COUNT(*) AS cnt FROM queries WHERE array_length(labels) <= $1";
      const result = await this.pgClient.query(statement, [keys.minLabelCount]);
      const count = parseInt(result.rows[0].cnt);
      if (count/keys.setSize >= keys.queryThreshold) {
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
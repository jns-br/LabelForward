const keys = require('../keys');
const { Pool } = require('pg');
const redis = require('redis');

class TweetRepository {
  constructor() {
    this.tweetCounter = 0;
    this.pgClient = new Pool({
      user: keys.pgUser,
      host: keys.pgHost,
      database: keys.pgDatabase,
      password: keys.pgPassword,
      port: keys.pgPort
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

  async insertLabeledTweet(tweet, labels) {
    try {
      const statement = "INSERT INTO results(news, labels) VALUES($1, $2::text[])";
      const result = await this.pgClient.query(statement, [tweet, labels]);
      if (result.rowCount !== 1) {
        throw new Error('Insertion failed');
      }
      return result;
    } catch (err) {
      console.error('DB error', err.message);
      throw message;
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

}

module.exports = new TweetRepository();
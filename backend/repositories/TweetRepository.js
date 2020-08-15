const keys = require('../keys');
const { Pool } = require('pg');

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

  async getNextTweet() {
    try {
      const statment = `SELECT headline, category, description FROM news WHERE news_id = ${++this.tweetCounter}`;
      const result = await this.pgClient.query(statment);
      const response = {
        tweet: result.rows[0].headline + ": " + result.rows[0].description,
        category: result.rows[0].category  
      };
      return response;
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


  init() {
    try {
      this.pgClient = new Pool({
        user: keys.pgUser,
        host: keys.pgHost,
        database: keys.pgDatabase,
        password: keys.pgPassword,
        port: keys.pgPort
      });
  
      this.pgClient.on('connect', () => {
        this.pgClient
          .query('SELECT version()')
          .then(res => console.log(res))
          .catch(err => console.log(err));
      });
    } catch (err) {
      console.error('Init error', err.message);
      throw err;
    }
  }
}

module.exports = new TweetRepository();
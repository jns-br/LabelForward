const keys = require('../keys');
const { Pool } = require('pg');

class TweetRepository {
  constructor() {
    this.tweetCounter = 0;
    this.pgClient = null;
  }

  async getNextTweet() {
    try {
      const statment = `SELECT headline, category, description FROM news WHERE news_id = ${++this.tweetCounter}`;
      const result = await this.pgClien.query(statment);
      return result;
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getLabels() {
    try {
      const statement = "SELECT category FROM news";
      const result = await this.pgClient.query(statement);
      return result.rows.filter((val, index, self) => {
        return self.indexOf(val) === index;
      })
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }


  async init() {
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
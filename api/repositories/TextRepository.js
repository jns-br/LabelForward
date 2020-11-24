const keys = require('../keys');
const statements = require('./statements');
const constants = require('../constants');
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
  }

  async getNextText(email) {
    try {
      const redisClient = new Redis({ port: keys.redisPort, host: keys.redisHost });
      const queryFlag = await redisClient.get(constants.keyQueryFlag);
      switch (queryFlag) {
        case constants.keyAvailable:
          if(keys.activeLearning === 'true') {
            const statement = statements.selectNextText;
            const result = await this.pgClient.query(statement, [email]);
            let uncertainty;
            if (result.rowCount > 0) {
              uncertainty = parseFloat(result.rows[0].uncertainty);
            }

            const statement_ignore = statements.selectNextTextIgnored;
            const result_ignore = await this.pgClient.query(statement_ignore, [email]);
            let uncertainty_ignore;
            if(result_ignore.rowCount > 0) {
              uncertainty_ignore = parseFloat(result_ignore.rows[0].uncertainty);
            }
            
            const uncertainty_threshold = parseFloat(keys.uncertaintyThreshold);
            if (uncertainty_ignore && uncertainty) {
              if (uncertainty_ignore - uncertainty >= uncertainty_threshold) {
                await this.insertStartTime(email, parseInt(result_ignore.rows[0].text_id));
                return result_ignore.rows[0];
              } else {
                await this.insertStartTime(email, parseInt(result.rows[0].text_id));
                return result.rows[0];
              }
            } else if (uncertainty) {
              await this.insertStartTime(email, parseInt(result.rows[0].text_id));
              return result.rows[0];
            } else if (uncertainty_ignore) {
              await this.insertStartTime(email, parseInt(result_ignore.rows[0].text_id));
              return result_ignore.rows[0];
            } else {
              return {};
            }
          } else {
            const statement = statements.selectNextTextNonAL;
            const result = await this.pgClient.query(statement, [email]);
            if (result.rowCount > 0) {
              return result.rows[0];
            } else {
              return {};
            }
          }
          
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
      const redisClient = new Redis({ port: keys.redisPort, host: keys.redisHost });
      const queryFlag = await redisClient.get(constants.keyQueryFlag);
      if (queryFlag == constants.keyAvailable) {
        const statment = statements.insertText;
        await this.pgClient.query(statment, [label, email, text_id]);
        await this.insertEndTime(email, text_id);
        const queryCounter = parseInt(await redisClient.get(constants.keyQueryCounter));
        await redisClient.set(constants.keyQueryCounter, (queryCounter + 1));
        if ((queryCounter + 1) % parseInt(keys.batchSize) === 0) {
          const pub = redisClient.duplicate();
          await pub.publish(constants.keyLearner, constants.msgUpdate);
        }
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async getLabels() {
    try {
      const statement = statements.selectLabels;
      const results = await this.pgClient.query(statement);
      return Array.from(results.rows, result => result.label);
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertStartTime(email, textId) {
    try {
      const statementUser = 'SELECT user_id FROM users WHERE email = $1'
      const resultUser = await this.pgClient.query(statementUser, [email]);
      const userId = parseInt(resultUser.rows[0].user_id);

      const date = Date.now() / 1000;
      const statementInsert = 'INSERT INTO sample_timestamps(user_id, text_id, start_time) VALUES($1, $2, to_timestamp($3))';
      await this.pgClient.query(statementInsert, [userId, textId, date])
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }

  async insertEndTime(email, textId) {
    try {
      const statementUser = 'SELECT user_id FROM users WHERE email = $1'
      const resultUser = await this.pgClient.query(statementUser, [email]);
      const userId = parseInt(resultUser.rows[0].user_id);

      const date = Date.now() / 1000;
      const statementInsert = 'UPDATE sample_timestamps SET end_time = to_timestamp($1) WHERE text_id = $2 AND user_id = $3';
      await this.pgClient.query(statementInsert, [date, textId, userId]);
    } catch (err) {
      console.error('DB error', err.message);
      throw err;
    }
  }
}

module.exports = new TextRepository();
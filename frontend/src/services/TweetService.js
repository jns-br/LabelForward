import axios from 'axios';

class TweetService {
  async getLabels() {
    try {
      const labels = await axios.get('/api/tweets/labels');
      return labels;
    } catch (err) {
      throw err;
    }
  }

  async getTweet() {
    try {
      const tweet = await axios.get('/api/tweets/tweet');
      return tweet;
    } catch (err) {
      throw err;
    }
  }

  async postTweet(label, tweet_id) {
    try {
      const result = await axios.post('/api/tweets/tweet', {
        label: label,
        tweet_id: tweet_id
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default new TweetService();
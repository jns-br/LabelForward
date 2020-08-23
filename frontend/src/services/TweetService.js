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

  async postTweet(tweet, labels) {
    try {
      await axios.post('/api/tweets/tweet', {
        tweet: tweet,
        labels: labels
      });
    } catch (err) {
      throw err;
    }
  }
}

export default new TweetService();
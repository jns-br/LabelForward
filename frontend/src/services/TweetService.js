import axios from 'axios';

class TweetService {
  async fetchLabels() {
    try {
      const labels = await axios.get('/api/tweets/labels');
      return labels;
    } catch (err) {
      throw err;
    }
  }
}

export default new TweetService();
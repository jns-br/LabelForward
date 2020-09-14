import axios from 'axios';

class TextService {
  async getLabels() {
    try {
      const labels = await axios.get('/api/tweets/labels');
      return labels;
    } catch (err) {
      throw err;
    }
  }

  async getText() {
    try {
      const tweet = await axios.get('/api/tweets/text');
      return tweet;
    } catch (err) {
      throw err;
    }
  }

  async postText(label, text_id) {
    try {
      const result = await axios.post('/api/tweets/text', {
        label: label,
        text_id: text_id
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default new TextService();
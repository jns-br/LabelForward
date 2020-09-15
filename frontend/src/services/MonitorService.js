import axios from 'axios';

class MonitorService {
  async getClfData() {
    try {
      const clfData = await axios.get('/api/monitor/classifiers');
      return clfData;
    } catch (err) {
      throw err;
    }
  }

  async getLabelShare() {
    try {
      const labelShare = await axios.get('/api/monitor/label');
      return labelShare;
    } catch (err) {
      throw err;
    }
  }
}

export default new MonitorService();
import axios from 'axios';

class MonitorService {
  async getClfData() {
    try {
      const clfData = await axios.get('/api/monitor/classifiers');
      return clfData.data;
    } catch (err) {
      throw err;
    }
  }

  async getLabelShare() {
    try {
      const labelShare = await axios.get('/api/monitor/label');
      return labelShare.data;
    } catch (err) {
      throw err;
    }
  }

  async requestDownload(clfId) {
    try {
      await axios.post('/api/monitor/download', {
        clfId: clfId
      });
    } catch (err) {
      throw err;
    }
  }

  async startDownload(clfId) {
    try {
      await axios.get('/api/monitor/download', { params: { clfId: clfId}});
    } catch (err) {
      throw err;
    }
  }
}

export default new MonitorService();
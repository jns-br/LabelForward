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
      const res = await axios.get('/api/monitor/download', { 
        params: { clfId: clfId },
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/zip'
        }
      });
      const data = res.data;
      const dlUrl = window.URL.createObjectURL(new Blob([data], {type: 'application/zip'}));
      const link = document.createElement('a');
      link.href = dlUrl;
      const fileName = 'data-' + clfId + '.zip' 
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err) {
      throw err;
    }
  }
}

export default new MonitorService();
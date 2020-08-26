import axios from 'axios';
import JWTService from './JWTService';

class AuthService {
  async login(email, password) {
    try {
      const res = await axios.post('/api/login/', {
        email: email,
        password: password
      }, {
        withCredentials: true
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async checkToken() {
    try {
      const res = await axios.get('/api/login/');
      return res;
    } catch (err) {
      throw err;
    }
  }

  getUser() {
    const { sub } = JWTService.getPayload();
    return {userId: sub};
  }

  isAuthenticated() {
    return !!JWTService.getJWT();
  }

  async logout() {
    try {
      const res = await axios.get('/api/login/logout');
      return res;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
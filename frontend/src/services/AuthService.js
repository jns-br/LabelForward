import axios from 'axios';
import JWTService from './JWTService';

class AuthService {
  constructor() {
    // if axios detects 401 -> logout
    axios.interceptors.response.use(
      response => response,
      async error => {
        if (error && error.response && error.response.status === 401) await this.logout();
        return Promise.reject(error);
      }
    );

    //if authticated add authorization header
    /*
    axios.interceptors.request.use(
      config => {
        if (this.isAuthenticated()) config.headers.authorization = JWTService.getJWT();
        return config;
      },
      error => Promise.reject(error)
    );
    */
  }

  async login(email, password) {
    try {
      const res = await axios.post('/api/login/', {
        email: email,
        password: password
      }, {
        withCredentials: true
      });
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
import axios from 'axios';
import JWTService from './JWTService';

class AuthService {
  constructor() {
    // if axios detects 401 -> logout
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error && error.response && error.response.status === 401) this.logout();
        return Promise.reject(error);
      }
    );

    //if authticated add authorization header
    axios.interceptors.request.use(
      config => {
        if (this.isAuthenticated()) config.headers.authorization = JWTService.getJWT();
        return config;
      },
      error => Promise.reject(error)
    );
  }

  async login(email, password) {
    try {
      const res = await axios.post('/api/login/', {
        email: email,
        password: password
      });
      JWTService.storeJWT(res.data.token);
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

  logout() {
    JWTService.removeJWT();
  }
}

export default new AuthService();
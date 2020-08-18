import axios from 'axios';
import JWTService from './JWTService';

class AuthService {
  constructor() {
    // if axios detects 401 -> logout

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

  isAuthenticated() {
    return !!JWTService.getJWT();
  }

  logout() {
    JWTService.removeJWT();
  }
}

export default new AuthService();
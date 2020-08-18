const JWT = require('jsonwebtoken');

class JWTService {
  storeJWT(token) {
    localStorage.setItem('covid-state-jwt', token);
  }

  getJWT() {
    return localStorage.getItem('covid-state-jwt');
  }

  getPayload() {
    const token = this.getJWT();
    return JWT.decode(token);
  }

  removeJWT(){
    return localStorage.removeItem('covid-state-jwt');
  }
}

export default new JWTService();
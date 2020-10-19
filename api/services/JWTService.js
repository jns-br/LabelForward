const JWT = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;
const constants = require('../constants');

class JWTService {

  requireJWT() {
    return passport.authenticate(constants.keyJwt, {session: false});
  }

  requireCredentials() {
    return passport.authenticate(constants.keyLocal, {session: false});
  }

  signToken(user_id) {
    return JWT.sign({
      iss: 'labelforward',
      sub: user_id,
      exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
  }
}

module.exports = new JWTService();
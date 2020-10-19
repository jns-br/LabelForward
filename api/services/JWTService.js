const JWT = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

class JWTService {

  requireJWT() {
    return passport.authenticate('jwt', {session: false});
  }

  requireCredentials() {
    return passport.authenticate('local', {session: false});
  }

  signToken(user_id) {
    return JWT.sign({
      iss: 'covidstateweb',
      sub: user_id,
      exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
  }
}

module.exports = new JWTService();
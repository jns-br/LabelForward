const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = require('./keys').jwtSecret;
const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const constants = require('./constants');

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[constants.keyAccessToken];
  }
  return token;
}
class Passport {
  async init() {

    //authorization
    passport.use(new JwtStrategy({
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true
    }, async (req, payload, done) => {
      try {
        const user = await UserRepository.findUserById(payload.sub.user_id);

        if (!user) {
          return done(null, false);
        }
        req.user = user;
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }));

    //authentication
    passport.use(new LocalStrategy({
      usernameField: constants.keyEmail
    }, async (email, password, done) => {
      try {
        const user = await UserRepository.findUserByEmail(email);

        if (!user) {
          done(null, false);
        }

        const isMatch = await UserService.compareHashed(password, user.password);

        if (!isMatch) {
          return done(null, false);
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }));

    console.log('Passport initialized');
  }
}

module.exports = new Passport();
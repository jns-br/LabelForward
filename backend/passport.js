const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWT_SECRET = process.env.JWT_SECRET;
const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');

class Passport {
  async init() {

    //authorization
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJWT.fromHeader('authorization'),
      secretOrKey: JWT_SECRET
    }, async (payload, done) => {
      try {
        const user = await UserRepository.findUserById(payload.sub);

        if (!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }));

    //authentication
    passport.use(new LocalStrategy({
      usernameField: 'email'
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
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JWT_SECRET = process.env.JWT_SECRET;
const UserRepository = require('./repositories/UserRepository');
const ExtractJWT = require('passport-jwt').ExtractJwt;

class Passport {
  async init() {
    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJWT.fromHeader('authorization'),
      secretOrKey: JWT_SECRET
    }, async(payload, done) => {
      try {
        const user = await UserRepository.findUserById(payload.sub);

        if(!user) {
          return done(null, false);
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }));
  }
}

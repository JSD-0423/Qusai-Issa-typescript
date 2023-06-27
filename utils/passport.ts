// passport.ts

const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

// Function to verify the JWT
const verifyCallback = (jwtPayload, done) => {
  const { userId } = jwtPayload;
  // Perform any necessary checks on the user or token
  // (e.g., validate user existence, check user roles/permissions)

  // Pass the user ID to the next middleware or route handler
  return done(null, userId);
};

passport.use(new JwtStrategy(options, verifyCallback));

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false }),
};

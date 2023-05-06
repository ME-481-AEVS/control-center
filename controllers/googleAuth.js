const GoogleStrategy = require('passport-google-oauth20').Strategy;
const clientID = require('../config/googleData').clientId;
const { clientSecret } = require('../config/googleData');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: '/user/login/callback',
  }, (accessToken, refreshToken, profile, done) => {
    const googleEmail = profile.emails[0].value;
    if (googleEmail === 'godfrey7@hawaii.edu' || googleEmail === 'ob3@hawaii.edu') {
      return done(null, { email: googleEmail });
    }
    return done(null);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

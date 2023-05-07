const fs = require('fs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const clientID = require('../config/googleData').clientId;
const { clientSecret } = require('../config/googleData');
const { authUsers } = require('../config/googleData');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: '/user/login/callback',
  }, (accessToken, refreshToken, profile, done) => {
    const googleEmail = profile.emails[0].value;
    if (authUsers.includes(googleEmail)) {
      fs.appendFile(
        'config/logins.log',
        `${'Authorized'.padEnd(20)}${profile.displayName.padEnd(30)}${googleEmail.padEnd(30)}${new Date(Date.now()).toISOString().padEnd(20)}\n`,
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Authorized login logged');
          }
        },
      );
      return done(null, { email: googleEmail });
    }
    fs.appendFile(
      'config/logins.log',
        `${'** UNAUTHORIZED **'.padEnd(20)}${profile.displayName.padEnd(30)}${googleEmail.padEnd(30)}${new Date(Date.now()).toISOString().padEnd(20)}\n`,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Unauthorized login logged');
        }
      },
    );
    return done(null);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

// import fs from 'fs';
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
// import { authUsers } from '../config/googleData'; list of authorized users todo add back

dotenv.config();

const clientID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const googleAuth = (passport) => {
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL: '/user/login/callback',
  }, (accessToken, refreshToken, profile, done) => {
    const googleEmail = profile.emails[0].value;
    // if (authUsers.includes(googleEmail)) {
    // fs.appendFile(
    //   'log/logins.log',
    //   `${'Authorized'.padEnd(20)}${profile.displayName.padEnd(30)}${googleEmail.padEnd(30)}${new Date(Date.now()).toISOString().padEnd(20)}\n`,
    //   (err) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('Authorized login logged');
    //     }
    //   },
    // );
    return done(null, { email: googleEmail });
    /*
    fs.appendFile(
      'log/logins.log',
        `${'** UNAUTHORIZED **'.padEnd(20)}${profile.displayName.padEnd(30)}
        ${googleEmail.padEnd(30)}${new Date(Date.now()).toISOString().padEnd(20)}\n`,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Unauthorized login logged');
        }
      },
    );
    return done(null);
     */
  }));

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default googleAuth;

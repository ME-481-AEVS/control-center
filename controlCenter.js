const fs = require('fs');
const https = require('https');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mapKey = require('./config/apikey');

require('./controllers/googleAuth')(passport);

const app = express(); // init app

/*
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/privkey.pem')
};
*/

app.use('/scripts/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${__dirname}/node_modules/bootstrap-icons/font/`));
app.use('/scripts/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use('/scripts', express.static(`${__dirname}/scripts`));

app.use(express.static(`${__dirname}/views`)); // load views
app.use(express.static(`${__dirname}/views/components`)); // load components
app.use(express.static(`${__dirname}/public`)); // define public folder

// express session
app.use(session({
  secret: 'hehe',
  resave: true,
  saveUninitialized: true,
  cooke: { secure: true },
}));

// passport config
require('./controllers/googleAuth')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); // set view engine to ejs

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/sign_in');
}

// home route
app.get('/sign_in', (req, res) => {
  res.render('sign_in');
});

app.get('/user/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/user/login/callback',
  passport.authenticate('google', { failureRedirect: '/401' }),
  (req, res) => {
    res.redirect('/');
  },
);
// logout
app.get('/user/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/sign_in');
    }
  });
});

app.get('/401', (req, res) => {
  res.render('401');
});

// home route
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('list');
});

// map route
app.get('/map', ensureAuthenticated, (req, res) => {
  res.render('map', { mapKey });
});

// aev cameras/info route
app.get('/aev', ensureAuthenticated, (req, res) => {
  res.render('aev');
});

// manual control route
app.get('/manual_control', ensureAuthenticated, (req, res) => {
  res.render('manual_control');
});

// start server
app.listen(3000, () => console.log('Server started on port 3000.'));
// https.createServer(options, app).listen(3000);

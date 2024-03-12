const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const mapKey = process.env.THUNDERFOREST_API_KEY;
const app = express(); // init app

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/sign-in');
}

app.use('/scripts/bootstrap', express.static(`${__dirname}/../node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${__dirname}/../node_modules/bootstrap-icons/font/`));
app.use('/scripts/jquery', express.static(`${__dirname}/../node_modules/jquery/dist/`));
app.use('/scripts', express.static(`${__dirname}/../scripts`));

app.use(express.static(`${__dirname}/../views`)); // load views
app.use(express.static(`${__dirname}/../views/components`)); // load components
app.use(express.static(`${__dirname}/../public`)); // define public folder

// express session
app.use(session({
  secret: 'hehe',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true },
}));

const passport = require('passport');
require('../controllers/googleAuth')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); // set view engine to ejs

// home route
app.get('/sign-in', (req, res) => {
  res.render('sign-in');
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
      res.redirect('/sign-in');
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

// start server
app.listen(8000, () => console.log('Server started on port 8000.'));

module.exports = app;

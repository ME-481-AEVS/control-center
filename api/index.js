import fs from 'fs';
import https from 'https';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import url from 'url';
import googleAuth from '../controllers/googleAuth.js';

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH),
  key: fs.readFileSync(process.env.KEY_PATH),
};

const app = express(); // init app

app.use(express.json());

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/sign-in');
}

app.use('/scripts/bootstrap', express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../node_modules/bootstrap-icons/font/`));
app.use('/scripts/jquery', express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../node_modules/jquery/dist/`));
app.use('/scripts', express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../scripts`));

app.use(express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../views`)); // load views
app.use(express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../views/components`)); // load components
app.use(express.static(`${url.fileURLToPath(new URL('.', import.meta.url))}/../public`)); // define public folder

app.set('trust proxy', true);

// express session
app.use(session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

googleAuth(passport);
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
  res.render('map', { mapKey: process.env.THUNDERFOREST_API_KEY });
});

// aev cameras/info route
app.get('/aev', ensureAuthenticated, (req, res) => {
  res.render('aev');
});

// start server
// app.listen(80, () => console.log('Server started on port 80.'));
https.createServer(options, app).listen(443);

export default app;

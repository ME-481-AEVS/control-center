const fs = require('fs');
const https = require('https');
const express = require('express');
const mapKey = require('./config/apikey');

const app = express(); // init app

const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/uhm-aevs.online/privkey.pem')
};

app.use('/scripts/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${__dirname}/node_modules/bootstrap-icons/font/`));
app.use('/scripts/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use('/scripts', express.static(`${__dirname}/scripts`));

app.use(express.static(`${__dirname}/views`)); // load views
app.use(express.static(`${__dirname}/views/components`)); // load components
app.use(express.static(`${__dirname}/public`)); // define public folder

app.set('view engine', 'ejs'); // set view engine to ejs

// home route
app.get('/', (req, res) => {
  res.render('list');
});

// map route
app.get('/map', (req, res) => {
  res.render('map', { mapKey });
});

// aev cameras/info route
app.get('/aev', (req, res) => {
  res.render('aev');
});

// manual control route
app.get('/manual_control', (req, res) => {
  res.render('manual_control');
});

// start server
// http app.listen(3000, () => console.log(`Server started on port 3000.`));
https.createServer(options, app).listen(3000);


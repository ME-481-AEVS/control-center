const express = require('express');
const mapKey = require('./config/apikey');

const port = process.env.PORT || 3000;

const app = express(); // init app

app.use('/scripts/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist/`));
app.use('/scripts/bootstrap-icons', express.static(`${__dirname}/node_modules/bootstrap-icons/font/`));
app.use('/scripts/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));

app.use(express.static(`${__dirname}/views`)); // load views
app.use(express.static(`${__dirname}/views/components`)); // load components
app.use(express.static(`${__dirname}/public`)); // define public folder

app.set('view engine', 'ejs'); // set view engine to ejs

// home route
app.get('/', (req, res) => {
  res.render('list');
});

app.get('/map', (req, res) => {
  res.render('map', { mapKey });
});

app.get('/aev', (req, res) => {
  res.render('aev');
});

app.get('/manual_control', (req, res) => {
  res.render('manual_control');
});

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));

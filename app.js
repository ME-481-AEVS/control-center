const express = require('express');

const port = process.env.PORT || 3000;

const app = express(); // init app
app.set('view engine', 'ejs'); // set view engine to ejs

// home route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/manual_control', (req, res) => {
  res.render('manual_control');
});

console.log('hello control center');

// start server
app.listen(port, () => console.log(`Server started on port ${port}.`));

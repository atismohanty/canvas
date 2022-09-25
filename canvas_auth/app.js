var express = require('express');
var path = require('path');
const midwares = require('./plugnmiddlewares');

var app = express();

// Register the middlewares
app.use( [...midwares]);

// Register the routes
require('./routes/index')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

module.exports = app;

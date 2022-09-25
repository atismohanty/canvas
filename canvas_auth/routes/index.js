var express = require('express');
const fs =  require('fs');
const path = require('path');
const app = require('../app');
const createError = require('http-errors');

const registerRoutes = function(app) {

  app.use('/', express.Router().get('/', (req, res) => { res.render('index')}));

  getPathFiles('./routes', app);
  
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};

const getPathFiles = function(localPath, app) {  // Function which parses and registers all the routes
  const files = fs.readdirSync(localPath ? localPath : __dirname);
  if (files.length > 0) {
    files.forEach((file) => {

      if (fs.lstatSync(localPath + '/' + file ).isDirectory()) {
        getPathFiles(localPath + '/' + file, app);
      } else if( file.split('.').pop() === 'js') {
        if (file.split('.')[0] === 'index' ) {
          // Do nothing
        } else {
          console.log('/api/v1/' + file.split('.').shift(), localPath.replace('./routes', '.') + '/' + file.split('.').shift());
          app.use( '/api/v1/' + file.split('.').shift(), require(localPath.replace('./routes', '.') +'/'+ file.split('.').shift()));
        }

      }
    });
  } else {
    return;
  }
}

module.exports = registerRoutes;

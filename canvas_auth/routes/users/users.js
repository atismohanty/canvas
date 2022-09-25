var express = require('express');
var userService = require('../../services/userService');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource for the particular id');
});


router.get('/:id', function(req, res, next) {
  res.send('respond with a resource for the particular id');
});
module.exports = router;

const express = require('express');
const router = express.Router();
const {users} =  require("../../../services");

/* GET users listing. */
router.get('/', function(req, res, next) {
  const queryParams =  req.query;
  users.getAllUser(queryParams)
  .then((result) => {
    res.status(200).json(result).send();
  })
  .catch((err) => res.status(err.status? err.status : 500).json({ error: err.error, message: err.message ? err.message : 'Something went wrong'}).send())
});

router.post('/new', function(req, res, next) {
  console.log('request received');
  const userData =  req.body;
  const queryParams =  req.query;
  users.createUser(userData)
  .then((result) => {
    const userRes = Object.assign({}, {_id: result._id, username: result.username});
    res.status(200).json(userRes).send();
  })
  .catch((err) => res.status(err.status? err.status : 500).json({ error: err.error, message: err.message ? err.message : 'Something went wrong'}).send())
});
module.exports = router;

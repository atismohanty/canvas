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
  .then(async (result) => {
    const userRes = Object.assign({}, {_id: result._id, username: result.username});
    userData.id  = result._id;
    const initVerification = await users.initiateVerificationOfRegisterdUser(userData);
    if (initVerification.success) {
      userRes.verificationSent = true;
    }
    res.status(200).json(userRes).send(); 
  })
  .catch((err) => res.status(err.status? err.status : 500).json({ error: err.error, message: err.message ? err.message : 'Something went wrong'}).send())
});

router.get('/verify', async function(req, res, next) {
  console.log('Initiating the verification');
  try {
    const token =  req.query;
    const response = await users.verifyUserToken(token);
    console.log('token', '  ', token, '   verified response', response);
    if (response?.verified) {
      res.status(200).json({message: 'User verified'});
    } else {
      res.status(200).json({message: 'Error in User verification'});
    }
  } catch(err) {
    res.status(err.status ? err.status : 500).json({error: err, message: err.message ? err.message : 'Something went wrong'});
  }
});

module.exports = router;

const express = require('express');
const { authenticate } = require('passport');
const router = express.Router();
const passport = require("passport");
const userSchema = require("../../mongoSchema/userSchema");


/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}));


router.post('/login', function (req, res, next) {
  passport.authenticate('localStrategy',  function (err, user){
    if(err) return res.status(500).json({error: err});
    if(!user) return res.status(401).json({message : 'Username or password incorrect.'});
    userSchema.generateJsWebToken({id: user._id, email: user.emailAddress}).then(
      token => {
        const [accessToken, refreshToken] = [...token];
        console.log('--------------> ', accessToken, refreshToken);
        // token.expires = 3300;
        // token.username = user.username;
        res.status(200).json({...accessToken, ...refreshToken, expires: 3300, username: user.username}).send()
      },
      err => res.status(500).json({'message': 'Something went wrong. Please try again later', 'err': err}).send()
    ).catch((err) => res.status(500).json({'message': 'Something went wrong. Please try again later', 'err': err}).send())
  })(req, res, next)
});

router.post('/login/validate',function (req, res, next){
    const token = req.body.accesstoken ?  req.body.accesstoken : req.headers.authorization ? req.headers.authorization.replace('Bearer ', ''): '';
    console.log('token' , token, req.body);
    if (!token) {
      res.status(401).send({'message': 'Missing access token'});
      return;
    }
    userSchema.verifyJwtToken(token).then(
      jwtToken => {

        res.status(200).json({accessToken: token}).send();
        res.end();
      }, 
      err => {
        res.status(401).send('Invalid Token', err);
        res.end();
      });
});

module.exports = router;

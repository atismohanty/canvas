const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get('/fbredirect', passport.authenticate('facebook'),
(req, res, next) => {
    console.log('User successfully redirected and authenticated', req.user);
    res.status(200).send(JSON.stringify(req.user));
});

module.exports = router;
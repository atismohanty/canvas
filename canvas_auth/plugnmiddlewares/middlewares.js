const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const bodyParser = require("body-parser");
const passport = require('passport');
const passportConfig =  require("../services/passport-config");
const config =  require("config");
const cors =  require('cors');

const middleWares = [];
middleWares.push(logger('dev'));
middleWares.push(express.json());
// middleWares.push(passport);
middleWares.push(express.urlencoded({extended: false}));
middleWares.push(cookieParser());
middleWares.push(express.static(path.join(__dirname, 'public')));
middleWares.push(bodyParser.urlencoded({extended : false}));
middleWares.push(bodyParser.json());
middleWares.push(passport.initialize());
// middleWares.push(cors({origin: '*'}));
middleWares.push((req, res, next) => {
    if(! config.has('secret_key')) {
        console.log('FATAL ERROR : Secretkey not found. Exiting the application');
        process.exit(1);
    }
    next();
});



module.exports = middleWares;

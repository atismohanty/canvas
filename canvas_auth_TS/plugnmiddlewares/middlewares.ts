
import express from 'express';
import cookieParser from 'cookie-parser';
// import logger from 'logger';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from 'config';
import session from 'express-session';

class MiddleWares {
    middleWares: any = [];
    constructor() {
    }
    get midWares() {

         // middleWares.push(logger('dev'));
        this.middleWares.push(express.json());
        this.middleWares.push(express.urlencoded({extended: false}));
        this.middleWares.push(cookieParser());
        this.middleWares.push(session({saveUninitialized: false, resave: false, secret: 'AAKLASKLKKLASSKAKALKLSAM<PPPPASAPKPKSAPPAPAAAA'}));
        this.middleWares.push(express.static(path.join(process.cwd(), 'public')));
        this.middleWares.push(bodyParser.urlencoded({extended : false}));
        this.middleWares.push(bodyParser.json());
        this.middleWares.push(passport.initialize());
        this.middleWares.push((req: any, res: any, next: any) => {
            if(! config.has('secret_key')) {
                console.log('Processing the request for', req.url);
                console.log('FATAL ERROR : Secretkey not found. Exiting the application');
                res.status(500).send('FATAL ERROR : Secretkey not found. Exiting the application');
                process.exit(1);
            }
            next();
        });
        return this.middleWares;
    }
}

// module.exports = middleWares;
const midWares =  { midWares: [...(new MiddleWares().midWares)]};
export default midWares;

import { Router } from "express";
// import { authenticate } from "passport";
import passport from "passport";
import { Utils } from "../../services/index.js";




class AuthRouter {
  public router;
  constructor( router: Router) {
        this.router =  router;

        this.initRouteRegistration();
  }

  initRouteRegistration(): any { 
    this.router.get('/login/facebook', passport.authenticate('facebook', {
      scope: ['email', 'public_profile']
    }));
    
    
    this.router.post('/login', function (req, res, next) {
      passport.authenticate('localStrategy',  (err: any, user: any): any =>{
        console.log('Error--', err, 'User', user);
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(401).json({message : 'Username or password incorrect.'});
        Utils.generateJsWebToken({id: user._id, email: user.emailAddress}).then(
          (token: any) => {
            const [accessToken, refreshToken] = [...token];
            console.log('--------------> ', accessToken, refreshToken);
            res.status(200).json({...accessToken, ...refreshToken, expires: 3300, username: user.username}).send()
          },
          (err: any) => res.status(500).json({'message': 'Something went wrong. Please try again later', 'err': err}).send()
        ).catch((err: any) => res.status(500).json({'message': 'Something went wrong. Please try again later', 'err': err}).send())
      })(req, res, next)
    });
    
    this.router.post('/login/validate',function (req, res){
        const token = req.body.accesstoken ?  req.body.accesstoken : req.headers.authorization ? req.headers.authorization.replace('Bearer ', ''): '';
        console.log('token' , token, req.body);
        if (!token) {
          res.status(401).send({'message': 'Missing access token'});
          return;
        }
        Utils.verifyJwtToken(token).then(
          () => {
    
            res.status(200).json({accessToken: token}).send();
            res.end();
          }, 
          (err: any) => {
            res.status(401).send('Invalid Token' +  err);
            res.end();
          });
    });
    return this.router;
  }
}

export const AuthRouterFactory = () => new AuthRouter( Router());


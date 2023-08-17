
import { Router } from "express";
import { UserServiceFactory } from '../../../services/index.js';

class Registration {
  private users: any;
  public router: any;
  constructor(users: any, router: Router) {
    this.users =  users;
    this.router =  router;

    this.initRouteRegistration();
  }

  initRouteRegistration(): any {
    const _this =  this;


    this.router.get('/', function(req: any, res: any) {
      const queryParams =  req.query;
      _this.users.getAllUser(queryParams)
      .then((result: any) => {
        res.status(200).json(result).send();
      })
      .catch((err: any) => res.status(err.status? err.status : 500).json({ error: err.error, message: err.message ? err.message : 'Something went wrong'}).send())
    });
    
    this.router.post('/new', function(req: any, res: any) {
      const userData =  req.body;
      // const queryParams: any =  req.query;
      _this.users.createUser(userData)
      .then(async (result: any) => {
        const userRes: any = Object.assign({}, {_id: result._id, username: result.username});
        try {
          userData.id  = result._id;
          const initVerification = await _this.users.initiateVerificationOfRegisterdUser(userData);
          if (initVerification.success) {
            userRes.verificationSent = true;
          }
          res.status(200).json(userRes).send(); 
        } catch(err) {
          userRes.verificationSent =  false;
          res.status(200).json(userRes).send(); 
        }
        
      })
      .catch(
        (err: any) => {
          res.status(err.status? err.status : 500).json({ error: err.error, message: err.message ? err.message : 'Something went wrong'}).send()
        })
    });
    
    this.router.get('/verify', async function(req: any, res: any) {
      console.log('Initiating the verification');
      try {
        const token =  req.query;
        const response = await _this.users.verifyUserToken(token);
        console.log('token', '  ', token, '   verified response', response);
        if (response?.verified) {
          res.status(200).json({message: 'User verified'});
        } else {
          res.status(200).json({message: 'Error in User verification'});
        }
      } catch(err: any) {
        res.status(err.status ? err.status : 500).json({error: err, message: err.message ? err.message : 'Something went wrong'});
      }
    });

    return this.router;
  }

}

/* GET users listing. */

export const RegistrationRoute =  () => new Registration(UserServiceFactory(), Router())


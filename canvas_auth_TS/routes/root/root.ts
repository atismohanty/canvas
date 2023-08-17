
import { Router } from "express";


class Root {
  router: any;
  constructor() {
    this.router =  Router();

    this.initRouteRegistration();
  }


  initRouteRegistration() {
    this.router.get('/', function(req: any, res: any, next: any) {
      res.render('index', { title: 'Express' });
    });
  }
}


/* GET home page. */

export const RootRegister = () => new Root();

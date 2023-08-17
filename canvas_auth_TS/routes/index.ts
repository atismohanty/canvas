import express from 'express';
import fs from 'fs';
import { RootRegister } from './root/root.js';
import { AuthRouterFactory } from './auth/auth.js';
import { RedirectRouteFactory } from './auth/redirects/redirects.js';
import { RegistrationRoute } from './auth/registration/registration.js';
import { JsonObject, serve, setup} from 'swagger-ui-express';
import { json } from 'node:stream/consumers';


class RouteRegistration {

  constructor(){}

  async registerRoutes(app: any): Promise<void> {
    const fileContent = await fs.readFileSync('./scripts/swagger.json', {encoding: 'utf-8'});
    const jsonFormatted = await json(fileContent as any) as JsonObject
    app.use('/api/docs', serve,  setup(jsonFormatted));
    app.use('/', express.Router().get('/', (req: any, res: any) => { res.render('index')}));
    this.registerRoutHandlers(app);
  };
  
  getPathFiles(localPath: string, app: any): any {  // Function which parses and registers all the routes
    const files = fs.readdirSync(localPath ? localPath : __dirname); 
    if (files.length > 0) {
      files.forEach((file) => {
  
        if (fs.lstatSync(localPath + '/' + file ).isDirectory()) {
          this.getPathFiles(localPath + '/' + file, app);
        } else if( file.split('.').pop() === 'js') {
          if (file.split('.')[0] === 'index' ) {
            // Do nothing
          } else {
            console.log('/api/v1/' + file.split('.').shift(), localPath.replace('./routes', '.') + '/' + file.split('.').shift());
            app.use( '/api/v1/' + file.split('.').shift(), require(localPath.replace('./routes', '.') +'/'+ file.split('.').shift()));
          }
  
        }
      });
    } else {
      return;
    }
  }

  registerRoutHandlers(app: any): any {
    app.use('/api/v1/root', RootRegister().router);
    app.use('/api/v1/auth', AuthRouterFactory().router);
    app.use('/api/v1/auth/redirects', RedirectRouteFactory().router);
    app.use('/api/v1/auth/registration', RegistrationRoute().router);
  }
}

export default RouteRegistration;

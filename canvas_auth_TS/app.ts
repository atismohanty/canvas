import express from 'express';
import path from 'path';
import {midWares} from './plugnmiddlewares/index.js';
import RouteRegistration from './routes/index.js';
import {MongoConnection, PassportConfigFactory} from './services/index.js';

export class App {
    _app: any;
    routeRegistrer: any;
    dbConnection: any;
    passPortConfig: any;
    constructor() {
        this._app =  express();
        this.routeRegistrer =  new RouteRegistration();
        this.dbConnection =  MongoConnection();
        this.passPortConfig =  PassportConfigFactory();
        this.initExpress();
    }

    private initExpress() {
        this._app.use([...midWares.midWares]);
        this._app.set('views', path.join(process.cwd(), 'views'));
        this._app.set('view engine', 'pug');
        // Register the routes
        this.routeRegistrer.registerRoutes(this._app);
        
    }

    public get app() {
        return this._app;
    }
}

const app = App;
export default app
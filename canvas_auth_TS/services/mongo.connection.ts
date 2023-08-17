// const mongoose =  require("mongoose");
// const config = require("config");

import mongoose from 'mongoose';
import config from 'config';

class Connection {
    host: string;
    port: string;
    proto: string;
    constructor() {
        console.log('Mongo Env Var', process.env.MONGO_HOST);
        console.log('Mongo Env Var', process.env.MONGO_HOST_ALT);
        this.host =  config.get('mongo.mongodbServiceHost');
        this.port =  config.get('mongo.mongoosePort');

        // Enable this for local
        // this.host =  config.get('mongo.mongooseHost');
        // this.port =  config.get('mongo.mongoosePort');

        this.proto = config.get('mongo.protocol');
        this.initMongoConnection();
    }

    initMongoConnection(): any {
        console.log('Mongo Connection url', `${this.proto}://${this.host}:${this.port}/canvasstories`);
        mongoose.connect(`${this.proto}://${this.host}:${this.port}/canvasstories`, { useNewUrlParser: true , useUnifiedTopology: true }).then(
            () => console.log('Connection to mongo estabilished'),
            (err) => console.log('Something went wrong, debug log :', err) );
    }

}


export const MongoConnection = () =>  new Connection();


const mongoose =  require("mongoose");
const config = require("config");

const connect = function () {

    const host =  config.get('mongo.mongooseHost');
    const port =  config.get('mongo.mongoosePort');
    const proto = config.get('protocol');
    mongoose.connect(`${proto}://${host}:${port}/canvasstories`, { useNewUrlParser: true , useUnifiedTopology: true }).then(
        () => console.log('Connection to mongo estabilished'),
        (err) => console.log('Something went wrong, debug log :', err) );
}

module.exports ={connect: connect};
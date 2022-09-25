const mongo =  require('./mongo.connection');
const users = require('./userService');
module.exports = { mongoose : mongo , users: users};  
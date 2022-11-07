const { string, boolean } = require("joi");
const mongoose =  require("mongoose");
const joi = require("joi");
const jswebtoken = require("jsonwebtoken");
const config = require("config");
const { ObjectId } = require("mongoose");

const registrationSchema =  new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            require: true
        },
        userName : {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 32,
            validate: { validator: function(data) {
                    const exp = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/);
                    return exp.test(data);
                    },
                    message: 'User Name should be alphanumeric between 8-32 characters.' 
                }
        },
        emailAddress: {
            type: String,
            required: true,
            maxlength: 200,
            validate: { validator: function(data) {
                const exp = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
                return exp.test(data);
                },
                message: 'Invalid email address' 
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 200,
            // validate: { validator : function(data) {
            //             const exp = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&.?~_]).{8,32}$/);
            //             return exp.test(data);
            //              },
            //             message: 'The password should be between 8-32 characters including digits, capitalized and special characters(*.!@$%^&.?~_)'  
            // }
        },
        firstName: {type: String, required: true, maxlength: 200},
        lastName: {type: String, required: true, maxlength: 200 },
        userVerified: { type: Boolean}
    });

const federatedUserSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        profileName: {
            type: String
        },
        emailAddress: {
            type: String,
        },
        provider: {
            type: String,
            required: true
        }
    });

const validateFederatedSchema = function(data) {
    const schema = joi.object(
        {
            userId: joi.string().required(),
            profileName: joi.string(),
            emailAddress: joi.string(),
            provider: joi.string().required()
        }
    );
    try {
        const {error, value } = schema.validate(data);
        if (error) return Promise.reject({error: error});
        return Promise.resolve(value);
    } catch(err) {
        return Promise.reject({error: err});
    }
}

const validateRegistration = function(data) {
    const schema =  joi.object(
        {
            firstName: joi.string().required().max(200),
            lastName: joi.string().required().max(200),
            userName: joi.string().required().min(8).max(32).pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/)),
            //.message('Invalid user name. Username should be 8-32 characters long with only alphanumeric values'),
            emailAddress: joi.string().required().email(),
            //.message('Invalid email address.'),
            password: joi.string().required().min(8).max(32).pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&.?~_]).{8,32}$/))
            //.message('Invalid password. The password should be between 8-32 characters including digits, capitalized and special characters(*.!@$%^&.?~_)')
        }
    );
    try {
        const { error, value}  = schema.validate(data);
        if( error ) return Promise.reject({error : error});
        return Promise.resolve(value);
    } catch(err) {
        return Promise.reject({error: err});
    }
     
}

const generateJsWebToken =  function (payload) {
    const pvtKey =  config.get('secret_key');
    return Promise.all([
        new Promise((resolve, reject) => {
            jswebtoken.sign(payload, pvtKey, {'expiresIn' : 3600}, (err, key) => {
                if(err) reject(err);
                resolve({'accessToken': key});
            });
        }),

        new Promise((resolve, reject) => {
            jswebtoken.sign(payload, pvtKey, {'expiresIn' : 3600 * 24}, (err, key) => {
                if(err) reject(err);
                resolve({'refreshToken': key});
            });
        })
    ]);

}

const verifyJwtToken =  function(token) {
    const pvtKey = config.get('secret_key');
    return new Promise((resolve, reject) => {
        jswebtoken.verify(token, pvtKey, (err, decoded) => {
            if (err) { reject(err)}
            resolve(decoded);
        })
    })
}

module.exports = { registrationSchema, validateRegistration, generateJsWebToken, federatedUserSchema, validateFederatedSchema, verifyJwtToken};
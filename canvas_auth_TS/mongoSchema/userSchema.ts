import mongoose from "mongoose";
import Joi from 'joi';


export class UserSchema {
    constructor() {}

    public static initRegistrationSchema() {
        return  new mongoose.Schema(
            {
                userId: {
                    type: mongoose.Types.ObjectId,
                    require: true
                },
                userName : {
                    type: String,
                    required: true,
                    minlength: 8,
                    maxlength: 32,
                    validate: { validator: function(data: any) {
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
                    validate: { validator: function(data: any) {
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
    }

    public static initfederatedUserSchema(): any {
        return new mongoose.Schema(
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
    }

    public static validateFederatedSchema(data: any): any {
        const schema = Joi.object(
            {
                userId: Joi.string().required(),
                profileName: Joi.string(),
                emailAddress: Joi.string(),
                provider: Joi.string().required()
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

    public static validateRegistration(data: any) {
        const schema =  Joi.object(
            {
                firstName: Joi.string().required().max(200),
                lastName: Joi.string().required().max(200),
                userName: Joi.string().required().min(8).max(32).pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}$/)),
                //.message('Invalid user name. Username should be 8-32 characters long with only alphanumeric values'),
                emailAddress: Joi.string().required().email(),
                //.message('Invalid email address.'),
                password: Joi.string().required().min(8).max(32).pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&.?~_]).{8,32}$/))
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
       
}
// module.exports = { registrationSchema, validateRegistration, generateJsWebToken, federatedUserSchema, validateFederatedSchema, verifyJwtToken};
export default UserSchema;

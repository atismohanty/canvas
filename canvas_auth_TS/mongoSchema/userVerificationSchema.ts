
import mongoose from 'mongoose';
import Joi from 'joi';


export class UserVerificationSchema {

    public static initVerificationSchema(): any {
        return  new mongoose.Schema( {
            userId: {
                type: mongoose.Types.ObjectId, 
                required: true
            },
            verificationString: {
                type: String,
                required: true
            },
            tsCreated: {
                type: Number,
                required: true,
                default: Date.now()
            }
        });
    }

    public static validateUserVerificationSchema(usrVerificationData: any) {
        const schema = Joi.object({
            userId: Joi.required(),
            verificationString: Joi.string().required(),
            tsCreated: Joi.number()
        });
        try {
            const valid =  schema.validate(usrVerificationData);
            return valid;
        } catch(err){
            return false;
        }
    }
}

export default UserVerificationSchema;
import UserVerificationSchema from '../mongoSchema/userVerificationSchema.js';
import mongoose from 'mongoose';

class MongooseUserVerificationModel {
    userVerificationModel: any;

    constructor() {
       this.initVerificationModel();
    }

    initVerificationModel(): any {
        if (!this.userVerificationModel) {
            this.userVerificationModel = mongoose.model('verifyUser', UserVerificationSchema.initVerificationSchema());
        }
    }

    validateUserVerificationSchema(data: any): any {
        return UserVerificationSchema.validateUserVerificationSchema(data);
    }

    createUserVerification(data: any): any {
        const userVerificationModel =  new this.userVerificationModel(data);
        userVerificationModel.save();

    }

    async findVerificationData(verificationString: string): Promise<any> {
        return this.userVerificationModel.findone({verificationString}).exec();
    } 
}

export const UserVerificationModel = (() => {
    var userModel: any = null; 
    return () => {
        if(!userModel) { 
            userModel = new MongooseUserVerificationModel()
        }
        return Object.freeze(userModel);
    }
})()

import UserSchema from '../mongoSchema/userSchema.js';
import mongoose from 'mongoose';

class MongooseFederatedUserModel {
    federatedUserModel: any;

    constructor() {
        this.initFederatedUserModel();
    }


    initFederatedUserModel(): any {
        if(!this.federatedUserModel){
            this.federatedUserModel =  mongoose.model('fdusers', UserSchema.initfederatedUserSchema() );
        }
    }

    validateFederatedUserModel(data: any): any {
        return UserSchema.validateFederatedSchema(data);
    }

    async findFederateduser(data: any): Promise<any> {
        (new this.federatedUserModel).findOne({userId: data.id})
    }

    async createFederateduser(userData: any): Promise<any> {
       const userModel =  (new this.federatedUserModel)(userData);
       return userModel.save();
    }

}

export const FederatedUserModel = (() => {
    var model: any = null; 
    return () => {
        if(!model) { 
            model = new MongooseFederatedUserModel
        }
        return Object.freeze(model);
    }
})()
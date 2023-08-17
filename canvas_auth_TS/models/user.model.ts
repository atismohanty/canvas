import UserSchema from '../mongoSchema/userSchema.js';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

class MongooseUserModel {
    userModel: any;
    utils: any;

    constructor() {
        this.initMongoUserModel();
    }

    initMongoUserModel(): any {
        console.log('User model', this.userModel);
        if (!this.userModel) {
            console.log('User model called');
            this.userModel =  mongoose.model('users', UserSchema.initRegistrationSchema());
        }
        return this.userModel;
    }

    public validateRegistration(userData: any): any  {
        return UserSchema.validateRegistration(userData);
    }

    public async saveUser(userData: any): Promise<any> {
        await (new this.userModel)(userData).save();
    }

    public async findOneUser(findOption: any):Promise<any> {
        try {
            const user = await this.userModel.findOne(findOption);
            return user;
        } catch(err) {
            console.log('Error in finding the user', err);
            return  Promise.reject({status: 500, message: err});
        }
    }

    public async getUserList(options: {pageNumber: string, pageSize: string, sort: string }): Promise<any> {
        const pageNumber =  parseInt(options.pageNumber) || 1;
        const pageSize = parseInt (options.pageSize) || 10;
        let sort = options.sort;
        sort = this.utils.formatSort(sort, {'userName': 1});
        try {
            const allUsers = (new this.userModel)
            .find(this.utils.formatFind(options, ['pageNumber', 'pageSize', 'sort']))
            .skip((pageNumber -1) * pageSize)
            .sort(sort)
            .limit(pageSize)
            .count()
            .select({userName: 1, emailAddress: 1, firstName: 1, lastName: 1});
            return allUsers;
        } catch(err) {
            console.log('Error in finding the user', err);
            return  Promise.reject({status: 500, message: err});
        }
       
    }

    public static async encryptUserData(id: string, email: string): Promise<any> {
        try {
            const salt = await bcrypt.genSalt(10);
            const token = await bcrypt.hash(id + '-' + email, salt);
            return Promise.resolve(token);
        } catch(err) {
            return Promise.reject();
        }
    }

    public async finduserById(id: string ): Promise<any> {
        return this.userModel.findById(id).exec();
    }


}

export const UserModel = (() => {
    var userModel: any = null; 
    return () => {
        if(!userModel) { 
            userModel = new MongooseUserModel()
        }
        return userModel;
    }
})()
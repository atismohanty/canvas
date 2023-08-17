
import { Utils } from './utils.js';
import { UserModel } from '../models/user.model.js';
import { FederatedUserModel } from '../models/federated-user.model.js';
import { UserVerificationModel } from '../models/user.verification.model.js';


class UserService {
    userModel: any;
    federateduserModel: any;
    userVerificationModel: any
    constructor(userModel: any, federateduserModel: any, userVerificationModel: any) {
        this.userModel =  userModel;
        this.federateduserModel = federateduserModel;
        this.userVerificationModel = userVerificationModel;
    }

    public async createUser(userData: any): Promise<any> {
        try{
            await this.userModel.validateRegistration(userData);
            let user = await this.userModel.findOneUser({emailAddress: userData.emailAddress}) 
                || await this.userModel.findOneUser({usrname: userData.userName});


            if( !( user && user._id)) {
                userData =  await Utils.encryptData(userData);
                return this.userModel.saveUser(userData);
            } else {
                throw {status: 500, error: null , message: 'User with same userName or email address already exist.'};
            }
        } catch(err: any) {
                console.log('Error in registering the user', err);
                return Promise.reject({status: 500, error: err.error ? err.error : err, message: err.message});
        }
    }



    async getAllUser(options: {pageNumber: string, pageSize: string, sort: string }): Promise<any> {
        try{
            const allUsers = await this.userModel.getUserList(options);
            if(allUsers && allUsers.length) {
                return Promise.resolve(allUsers);
            } else {
                return Promise.reject({status: 500, error: '', message: 'Unable to get the users'});
            }
        } catch(err: any) {
            return Promise.reject({status: 500, error: err.error ? err.error : err, message: err.message})
        }
    }

    async createFederateUser(data: any): Promise<any> {
        try {
            const  valid = await this.federateduserModel.validateFederatedSchema(data);
            if (!valid) throw new Error('Invalid data');

            const response = await this.federateduserModel.findFederateduser(data);
            if (response) return Promise.resolve(response);

            this.federateduserModel.createFederateduser(data);
            Promise.resolve(data);
                
    
        } catch(err) {
            console.log('Error', err);
            return Promise.reject({error: err});
        }
    }
    
    async initiateVerificationOfRegisterdUser(userData: any) {
        try {
            const { data } =  await this.createVerificationSession(userData);
            if ( !!data.verificationString) {
                const dispatchEmail = await Utils.sendVerificationEmail(data);
                if( dispatchEmail.success) {
                    this.userVerificationModel.createUserVerification(data); // Create a session record once the email is successful
                }
            }
            return Promise.resolve({success: true});
        } catch (err) {
            console.log('Something went wrong', err);
            return Promise.reject(err);
        }
    
    }
    
    async createVerificationSession(userData: any): Promise<any> {
        try {
            const { id, emailAddress } = {...userData, id: '', emailAddress : ''};
            const verificationString = await this.userModel.encryptUserData(id, emailAddress);
            const data =  {
                userId: id,
                verificationString,
                emailAddress
            }
            const validateData  =  this.userVerificationModel.validateUserVerificationSchema(data);
            if (!validateData) {
                return Promise.reject({error: 'Validation Failed', message: 'Validation Failed'});
            }
            return Promise.resolve({data});
        } catch(err) {
            return Promise.reject(err);
        }
    }

    async verifyUserToken(param: any): Promise<any> {
        try {
            const verificationDoc = await this.userVerificationModel.findVerificationData(param.token);
            if (!verificationDoc) Promise.reject({ message: 'Invalid token.'});
            if (!(verificationDoc.verificationString === param.token && ((Date.now() - verificationDoc.tsCreated) < 3600000))) {
                Promise.reject({ message: 'Invalid or expired token.'});
            }
            const userDocument = await this.userModel.findOneUser(verificationDoc.userId);
            if(!userDocument) return Promise.reject({ message: 'Invalid User'});
            userDocument.userVerified =  true;
            userDocument.save();
            console.log('User document verified');
            Promise.resolve({verified: true});
            
        } catch(err) {
            console.log('Something went wrong. Catching the error');
            return Promise.reject({err: err, message: 'Error in verifying the user'});
        }
        
    }
    
}

// export default { UserModel, Users}

export const UserServiceFactory = (() => { // making singleton
    var userService: any = null;
    return () => {
        if(!userService) {
            userService = new UserService(UserModel(), FederatedUserModel(), UserVerificationModel());
        }
        return userService;
    }
})()

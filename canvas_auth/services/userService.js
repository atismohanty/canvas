const userSchema =  require("../mongoSchema/userSchema");
const userVerificationSchema =  require("../mongoSchema/userVerificationSchema");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
const nodeMailer =  require("nodemailer");
const config = require("config");
const { promises } = require("nodemailer/lib/xoauth2");
var Users;




const initMongoUserModel = function (){
    let user =  mongoose.model('users', userSchema.registrationSchema);
    return user;
}

const initFederatedUserModel =  function() {
    let fdUser = mongoose.model('fdusers', userSchema.federatedUserSchema );
    return fdUser;
}

const initVerificationModel =  function() {
    return mongoose.model('verifyUser', userVerificationSchema.usrVerificationSchema);
}

const findOneUser = async function(findOption) {
    try {
        const user = await Users.findOne(findOption);
        return user;
    } catch(err) {
        return  Promise.reject({status: 500, message: err});
    }
   
}

const createUser = async function(userData) {
    console.log('Validating in user object');
    try{
        const valid = await userSchema.validateRegistration(userData);
        Users = initMongoUserModel();
        let user = await findOneUser({emailAddress: userData.emailAddress}) || await findOneUser({usrname: userData.username});
        if( !( user && user._id)) {
            // Encrypt the password
            userData =  await encryptPwd(userData);
            let newUser = new Users(userData);
            return newUser.save();
        } else {
            throw {status: 500, error: null , message: 'User with same username or email address already exist.'};
        }
    } catch(err) {
            return Promise.reject({status: 500, error: err.error ? err.error : err, message: err.message});
    }
}

const getAllUser  = async function(options) {
    Users = initMongoUserModel();
    try{
        const pageNumber = options.pageNumber || 1;
        const pageSize = options.pageSize || 10;
        let sort = options.sort;
        sort = formatSort(sort, {'username': 1});
        const allUsers = await Users
        .find(formatFind(options, ['pageNumber', 'pageSize', 'sort']))
        .skip((pageNumber -1) * pageSize)
        .sort(sort)
        .limit(pageSize)
        .count()
        .select({username: 1, emailAddress: 1, firstName: 1, lastName: 1});
        if(allUsers && allUsers.length) {
            return Promise.resolve(allUsers);
        } else {
            return Promise.reject({status: 500, error: '', message: 'Unable to get the users'});
        }
    } catch(err) {
        return Promise.reject({status: 500, error: err.error ? err.error : err, message: err.message})
    }
}

const encryptPwd = async function (user) {
    try{
        const genSalt = await bcrypt.genSalt(10);
        console.log(genSalt);
        user.password = await bcrypt.hash(user.password, genSalt);
        console.log(user.password);
        return user;
    } catch(err) {
        return new err;
    }
}

const encryptUserData = async function(id, email) {
    try {
        const salt = await bcrypt.genSalt(10);
        const token = await bcrypt.hash(id + '-' + email, salt);
        return Promise.resolve(token);
    } catch(err) {
        return Promise.reject();
    }
}

const validatePwd = function(pwd, cmpPwd) {
  return  bcrypt.compare(pwd,cmpPwd);
}

const formatFind = function(options, arr) {
    try{
        const findOption = {};
        Object.keys(options).filter((opt) => !arr.includes(opt)).forEach((opt) => {
            findOption[opt] = options.opt;
        });
        if(Object.keys(findOption).length > 0) return findOption
        else return {};
    } catch(err) {
        return {}
    }
}

const formatSort =  function(sort, defSort) {
    if( sort === undefined || sort === null ) {
        return defSort;
    }
    let obj ={};
    let [field, type] = sort.split(':');
    obj[field.trim()] = type.trim() === 'asc' ? 1 : -1;
    return obj;
    
}

const createFederateUser = async function(data) {
    try {
        console.log('Creating federated user');
        const  valid = await userSchema.validateFederatedSchema(data);
        if (valid) {
            const fdUser =  initFederatedUserModel();
            console.log('Initiated the model');
            const response = await fdUser.findOne({userId: data.id});
            if (! response) {
                const newFdUser = new fdUser(data);
                newFdUser.save();
                console.log('Created federated user');
                Promise.resolve(data);
            } else {
                return Promise.resolve(response);
            }
            
        } else {
            throw new Error({err: 'Invalid data'})
        }

    } catch(err) {
        console.log('Error', err);
        return Promise.reject({error: err});
    }
}

const initiateVerificationOfRegisterdUser =async function(userData) {
    try {
        const { data, userVFData } =  await createVerificationSession(userData);
        if ( !!data.verificationString) {
            const dispatchEmail = await sendVerificationEmail(data);
            if( dispatchEmail.success) {
                userVFData.save(); // save the verification session
            }
        }
        return Promise.resolve({success: true});
    } catch (err) {
        console.log('Something went wrong', err);
        return Promise.reject(err);
    }

}

const createVerificationSession = async function(userData) {
    try {
        const { id, emailAddress } = {...userData};
        const verificationString = await encryptUserData(id, emailAddress);
        const data =  {
            userId: id,
            verificationString,
            emailAddress
        }
        const userVerify =   initVerificationModel();
        const validateData  =  userVerificationSchema.validateUserVerificationSchema(data);
        if (validateData) {
            const userVFData =  new userVerify(data);
            // userVFData.save();
            return Promise.resolve({data, userVFData});
        } else {
            return Promise.reject({error: 'Validation Failed', message: 'Validation Failed'});
        }

    } catch(err) {
        return Promise.reject(err);
    }
}

const sendVerificationEmail = async function(data){
    const configData =  config.get('mailer');
    const mailConfigData = {
            host: configData.host,
            port: configData.port,
            secure: configData.secure,
            auth: { user: configData.auth.username, pass: process.env.PWD },
    }
    const verificationString  = `http://localhost:3001/api/v1/registration/verify?token=${data?.verificationString}`;
    console.log("mailer data", mailConfigData);
    const info =  {
        from: configData.email,
        to: data.emailAddress,
        subject: "Verify your email",
        text: verificationString
    }
    console.log('Info', info);
    try {
        const transporter =  nodeMailer.createTransport(mailConfigData);
        const senderId =  await transporter.sendMail(info);
        console.log('Email Sent Successfully');
        return Promise.resolve({success: true});
    }catch(err){
        console.log('Something went wrong while sending the email', err);
        return Promise.reject({error: err,  message: 'Unable to send email'});
    }
}

const verifyUserToken = async function(param) {
    try {
        const verificationModel =  initVerificationModel();
        const userModel = initMongoUserModel();
        return new Promise((resolve, reject) => {
            verificationModel.findOne({verificationString: {$eq: param.token}}, (err, doc) => {
                if (err || !doc) {
                    console.log('Error in finding the  verification document');
                    reject({err: err, message: 'Invalid token.'});
                }
                if( doc?.verificationString === param.token && ((Date.now() - doc.tsCreated) < 3600000 ) ) {
                    return userModel.findById(doc.userId, (err, userdoc) => {
                        if (err || !userdoc) {
                            console.log('Erro in finding the  user');
                            reject({err: err, message: 'Invalid User'});
                        }
                        userdoc.userVerified =  true;
                        userdoc.save();
                        console.log('User document verified');
                        resolve({verified: true});
                    });
                }
            });
        });
        
    } catch(err) {
        console.log('Something went wrong. Catching the error');
        return Promise.reject({err: err, message: 'Error in verifying the user'});
    }
    
}


module.exports = {createUser, getAllUser, validatePwd, initMongoUserModel, createFederateUser, initiateVerificationOfRegisterdUser, verifyUserToken}
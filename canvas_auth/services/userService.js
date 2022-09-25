const userSchema =  require("../mongoSchema/userSchema");
const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");
var Users;



const initMongoUserModel = function (){
    let user =  mongoose.model('users', userSchema.registrationSchema);
    return user;
}

const initFederatedUserModel =  function() {
    let fdUser = mongoose.model('fdusers', userSchema.federatedUserSchema );
    return fdUser;
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

module.exports = {createUser, getAllUser, validatePwd, initMongoUserModel, createFederateUser}
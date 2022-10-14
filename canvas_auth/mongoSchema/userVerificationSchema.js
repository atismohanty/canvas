const { string, boolean, number} =  require('joi');
const mongoose =  require('mongoose');
const joi =  require('joi');
const { ObjectId } = require("mongoose");


const usrVerificationSchema =  new mongoose.Schema( {
    userId: {
        type: ObjectId, 
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

const validateUserVerificationSchema = function(usrVerificationData) {
    const schema = joi.object({
        userId: joi.required(true),
        verificationString: joi.string().required(true),
        tsCreated: joi.number()
    });
    try {
        const valid =  schema.validate(usrVerificationData);
        return valid;
    } catch(err){
        return false;
    }
}

module.exports = {validateUserVerificationSchema, usrVerificationSchema};
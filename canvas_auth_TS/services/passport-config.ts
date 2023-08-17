import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as  strategyFB } from "passport-facebook";
import config from 'config';
import { UserServiceFactory } from "./userService.js";
import { UserModel } from "../models/user.model.js";
import { Utils } from "./utils.js";


class PassportConfig {
    userModel: any;
    userService: any
    constructor(userModel: any, userService: any) {
        this.userModel =  userModel
        this.userService = userService;

        this.registerLocalStrategy();
        this.registerFacebookStrategy();
        this.serializeUser();
        this.deserializeUser();
    }

    registerLocalStrategy(): any {
        const _this =  this;
        passport.use('localStrategy', new LocalStrategy(
            async function(username: string, password: string, done: any) {
                console.log(username, password);
                // 
                try {
                    let user =  await _this.userModel.findOneUser({$or: [{emailAddress: username}, {username: username}]});

                    if(!user) {
                        return done(null, false, {message: 'Invalid username or password'})
                    }
                    if(user && user.length > 0) {
                        user = user[0]; // incase of multiple users then assign the first one
                    }
                    if(user) {
                        Utils.validatePwd(password, user.password).then(
                            () => {return done(null, user)},
                            () => { return done(null, false, {message: 'Invalid username or password'})}
                        )
                    }
                } catch(err) {
                    return done(null, false, {message: 'Invalid username or password'})
                }
                
            }
        ));
        
    }

    registerFacebookStrategy():any {
        const configData: {appId: string, appSecret: string, callBackUrl: string} =  config.get('facebookApp');
        const _this =  this;
        passport.use('facebook', new strategyFB({
            clientID: configData.appId,
            clientSecret: configData.appSecret,
            callbackURL: configData.callBackUrl
            },
            async function (accessToken: string, refreshToken: string, profile, cb) {
                if ( profile) {
                    console.log('User profile received from FB', profile);
                    console.log('Access Token ', accessToken, 'RefreshToken', refreshToken);
                    const newUserData = {
                        userId: profile.id + '',
                        profileName: profile.username + '',
                        emailAddress: 'xyz@example.com',
                        provider: profile.provider + ''
                    };
                    console.log('New User Data', {...newUserData});
                    try {
                        await _this.userService.createFederateUser(newUserData);
                    } catch(err) {
                        return cb(err);
                    }
                    console.log('User authenticated');
                    const serializableUserData =  {_id: newUserData.userId};
                    return cb(null, serializableUserData);
                }
                return cb(null, false);
            }
        ));
    }

    serializeUser(): any {
        passport.serializeUser(function(user: any, done) {
            done(null, user._id);
        });
    }

    deserializeUser(): any {
        const _this =  this;
        passport.deserializeUser(async function(id, done) {
            try {
                const user = await _this.userModel.finduserById(id);
                if(!user) return done(null);
                return done(null, {user: user});
            } catch(err) {
                done(err);
            }
        });
    }

}

export const PassportConfigFactory = () => new PassportConfig(UserModel(), UserServiceFactory());
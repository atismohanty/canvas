import * as nodeMailer from 'nodemailer';
import bcrypt from 'bcrypt';
import config from 'config';
import jswebtoken from 'jsonwebtoken';


export class Utils {
    constructor() {}

    public static async encryptData(data:  any): Promise<any> {
        try{
            const genSalt = await bcrypt.genSalt(10);
            console.log(genSalt);
            data.password = await bcrypt.hash(data.password, genSalt);
            console.log(data.password);
            return data;
        } catch(err: any) {
            return new err;
        }
    }



    public static validatePwd(pwd: string, cmpPwd: string): any {
        return  bcrypt.compare(pwd,cmpPwd);
    }

    public static formatFind(options: any, arr: any[]): any {
        try{
            const findOption: any = {};
            Object.keys(options).filter((opt) => !arr.includes(opt)).forEach((opt: string) => {
                findOption[opt] = options.opt;
            });
            if(Object.keys(findOption).length > 0) return findOption
            else return {};
        } catch(err) {
            return {}
        }
    }

    public static formatSort(sort: string, defSort: string) {
        if( sort === undefined || sort === null ) {
            return defSort;
        }
        let obj: any ={};
        let [field, type] = sort.split(':');
        obj[field.trim()] = type.trim() === 'asc' ? 1 : -1;
        return obj;
        
    }

    public static async sendVerificationEmail(data: any){
        const configData: {host: string, port: string, secure: string, email: string, auth: {username: string}} =  config.get('mailer');
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
            const transporter =  nodeMailer.createTransport(mailConfigData as any);
            const senderId =  await transporter.sendMail(info);
            console.log('Email Sent Successfully', senderId);
            return Promise.resolve({success: true});
        }catch(err){
            console.log('Something went wrong while sending the email', err);
            return Promise.reject({error: err,  message: 'Unable to send email'});
        }
    }

    public static generateJsWebToken(payload: any): any {
        const pvtKey =  config.get('secret_key') as jswebtoken.Secret;
        return Promise.all([
            new Promise((resolve, reject) => {
                jswebtoken.sign(payload, pvtKey, {'expiresIn' : 3600}, (err: any, key: any) => {
                    if(err) reject(err);
                    resolve({'accessToken': key});
                });
            }),
    
            new Promise((resolve, reject) => {
                jswebtoken.sign(payload, pvtKey, {'expiresIn' : 3600 * 24}, (err: any, key: any) => {
                    if(err) reject(err);
                    resolve({'refreshToken': key});
                });
            })
        ]);
    }

    public static verifyJwtToken(token: string): any {
        const pvtKey = config.get('secret_key') as jswebtoken.Secret;
        return new Promise((resolve, reject) => {
            jswebtoken.verify(token, pvtKey, (err: any, decoded: any) => {
                if (err) { reject(err)}
                resolve(decoded);
            });
        });
    }
}

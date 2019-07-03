import UserModel from '../models/userModel'
import TokenModel from '../models/tokenModel'
import utils from '../utils'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

function getUsers() {

    return new Promise((resolve, reject) => {

        UserModel.find({}, (error, users) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!users.length) {
                reject({
                    status: 401,
                    msg: 'No Musics in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: users,
                })
            }
        });
    });
}

function getUserById(userId) {

    return new Promise((resolve, reject) => {

        UserModel.findById(userId, (error, user) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!user) {
                reject({
                    status: 401,
                    msg: 'No user with this id in Database'
                })
            }
            else {
                resolve({
                    status: 200,
                    data: user,
                })
            }
        });
    });
}

function deleteUserById(userId) {

    return new Promise((resolve, reject) => {

        UserModel.findById(userId, (error, user) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!user) {
                reject({
                    status: 401,
                    msg: 'No user with this id in Database'
                })
            }
            else {
                user.remove((error, user) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    }
                    else {
                        resolve({
                            status: 200,
                            data: user,
                        })
                    }
                })
            }
        });
    });
}

function addUser(login, password, name, familyName, email) {

    return new Promise(async (resolve, reject) => {

        let salt = await bcrypt.genSaltSync(10);
        let hash = await bcrypt.hashSync(password, salt);

        const user = new UserModel({
            login,
            password: hash,
            name,
            familyName,
            email,
        });

        user.save((error, user) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else {
                let token = new TokenModel({
                    user: user._id,
                    token: crypto.randomBytes(16).toString('hex')
                });
                token.save(function (error) {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        });
                    }
                    else {
                        let link =  process.env.SERVER + "/api/users/confirm/" + token.token;

                        let mailOptions = {
                            from: '"MusicRoom Team" <team@musicroom.com>',
                            to: user.email,
                            subject: 'Account Verification TokenModel',
                            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' +
                                process.env.SERVER + '\/api\/users\/confirmation\/' + token.token + '.\n',
                            html: '<html><body><h2>Welcome to MusicRoom !</h2>' +
                                '<p>Please verify your account by clicking on ' +
                                '<a href="'+ link + '">this link.' +
                                '</a></p></body></html>',
                        };
                        utils.sendMail(mailOptions, resolve, reject);
                    }
                });
            }
        });
    });
}

function confirmEmail(tokenString) {

    return new Promise((resolve, reject) => {

        TokenModel.findOne({token: tokenString}, (error, token) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!token) {
                reject({
                    status: 400,
                    msg: 'No Token with this id, it may have expired'
                })
            }
            else {
                UserModel.findById(token.user, (error, user) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    }
                    else if (user) {
                        if (user.isVerified) {
                            reject({
                                status: 400,
                                msg: 'User already verified'
                            })
                        }
                        else {
                            user.isVerified = true;
                            user.save((error, data) => {
                                if (error) {
                                    reject({
                                        status: 500,
                                        msg: error.msg,
                                    })
                                }
                                else {
                                    resolve({
                                        status: 200,
                                        data,       // user is now verified & can login
                                    })
                                }
                            });
                        }
                    }
                    else {
                        reject({
                            status: 400,
                            msg: 'No user for this Token in Database'
                        })
                    }
                })
            }
        });
    });
}

export default {
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    confirmEmail,
}
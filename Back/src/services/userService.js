import UserModel from '../models/userModel'
import TokenModel from '../models/tokenModel'
import utils from '../utils'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import sendMail from "../utils/mailer";

function getUsers() {

    return new Promise((resolve, reject) => {

        UserModel.find({}, (error, users) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            } else if (!users.length) {
                reject({
                    status: 401,
                    msg: 'No Musics in Database'
                })
            } else {
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
            } else if (!user) {
                reject({
                    status: 401,
                    msg: 'No user with this id in Database'
                })
            } else {
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
            } else if (!user) {
                reject({
                    status: 401,
                    msg: 'No user with this id in Database'
                })
            } else {
                user.remove((error, user) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    } else {
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

    // console.log('addUserServ');
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
                // console.log('addUser error');
                if (error.code === 11000) {                                                // Duplicate Key
                    let field = error.message.split("index: ")[1].split('_')[0];
                    reject({
                        status: 400,
                        msg: "An account with this " + field + " already exists.",
                    })
                }
                else {
                    reject({
                        status: 500,
                        msg: error.msg,
                    })
                }
            } else {
                sendMailToken(user)
                    .then((response) => {
                        resolve({
                            status: response.status,
                            data: response.data,
                        })
                    })
                    .catch((error) => {
                        reject({
                            status: error.status,
                            msg: error.msg,
                        })
                    })

                /*
                let token = new TokenModel({
                    type: 'verifyMail',
                    user: user._id,
                    token: crypto.randomBytes(16).toString('hex')
                });
                token.save(function (error) {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        });
                    } else {
                        let link = process.env.SERVER + "/api/users/confirm/" + token.token;

                        let mailOptions = {
                            from: '"MusicRoom Team"',
                            to: user.email,
                            subject: 'Account Verification Token',
                            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + link + '.\n',
                            html: '<html><body><h2>Welcome to MusicRoom !</h2>' +
                                '<p>Please verify your account by clicking on ' +
                                '<a href="' + link + '" rel="nofollow noreferrer noopener">this link.' +
                                '</a></p></body></html>',
                        };
                        utils.sendMail(mailOptions, resolve, reject);
                    }
                });*/
            }
        });
    });
}

function sendConfirmEmail(loginOrEmail) {

    return new Promise ((resolve, reject) => {

        findUserByLoginOrEmail(loginOrEmail)
            .then((response) => {
                let user = response.data;
                if (user.isVerified) {
                    reject({
                        status: 400,
                        msg: "User is already verified",
                    })
                }
                sendMailToken(user)
                    .then((response) => {
                        resolve({
                            status: 200,
                            data: response.data,
                        })
                    })
                    .catch((error) => {
                        reject({
                            status: error.status,
                            msg: error.msg,
                        })
                    })
            })
            .catch((error) => {
                reject({
                    status: error.status,
                    msg: error.msg,
                })
            })
    })
}

function sendMailToken(user) {

    return new Promise((resolve, reject) => {

        let token = new TokenModel({
            type: 'verifyMail',
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
                let link = process.env.SERVER + "/api/users/confirm/" + token.token;

                let mailOptions = {
                    from: '"MusicRoom Team"',
                    to: user.email,
                    subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: ' + link + '.\n',
                    html: '<html><body><h2>Welcome to MusicRoom !</h2>' +
                        '<p>Please verify your account by clicking on ' +
                        '<a href="' + link + '" rel="nofollow noreferrer noopener">this link.' +
                        '</a></p></body></html>',
                };
                utils.sendMail(mailOptions, resolve, reject);
            }
        });
    })
}

function confirmEmail(tokenString) {

    // console.log('confirmEmailSrv');
    return new Promise((resolve, reject) => {

        TokenModel.findOne({token: tokenString, type: 'verifyMail'}, (error, token) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            } else if (!token) {
                reject({
                    status: 400,
                    msg: 'No Token with this id, it may have expired'
                })
            } else {
                UserModel.findById(token.user, (error, user) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    } else if (user) {
                        if (user.isVerified) {
                            reject({
                                status: 400,
                                msg: 'User already verified'
                            })
                        } else {
                            user.isVerified = true;
                            user.save((error, data) => {
                                if (error) {
                                    reject({
                                        status: 500,
                                        msg: error.msg,
                                    })
                                } else {
                                    resolve({
                                        status: 200,
                                        data,       // user is now verified & can login
                                    })
                                }
                            });
                        }
                    } else {
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

function findUserByLoginOrEmail(loginOrEmail) {

    return new Promise((resolve, reject) => {
        UserModel.findOne({login: loginOrEmail}, (error, userByLogin) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            } else if (!userByLogin) {
                UserModel.findOne({email: loginOrEmail}, (error, userByEmail) => {
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    } else if (!userByEmail) {
                        reject({
                            status: 400,
                            msg: 'No User for this Login or Email',
                        })
                    } else {
                        resolve({
                            status: 200,
                            data: userByEmail,
                        })
                    }
                })
            } else {
                resolve({
                    status: 200,
                    data: userByLogin
                })
            }
        })
    });
}

function askPasswordReset(loginOrEmail) {

    return new Promise((resolve, reject) => {

        findUserByLoginOrEmail(loginOrEmail)
            .then((response) => {
                let user = response.data;
                TokenModel.findOne({user: user._id, type: 'resetPassword'}, (error, tokenByUser) => {
                    let token;
                    if (error) {
                        reject({
                            status: 500,
                            msg: error.msg,
                        })
                    } else if (!tokenByUser) {
                        token = new TokenModel({
                            type: 'resetPassword',
                            user: user._id,
                            token: crypto.randomBytes(16).toString('hex')
                        });
                    } else {
                        token = tokenByUser;
                        token.token = crypto.randomBytes(16).toString('hex');
                        token.createdAt = Date.now();
                    }
                    token.save(function (error) {
                        if (error) {
                            reject({
                                status: 500,
                                msg: error.msg,
                            });
                        } else {
                            let link = process.env.SERVER + "/api/users/resetPassword/" + token.token;
                            let mailOptions = {
                                from: '"MusicRoom Team" <team@musicroom.com>',
                                to: user.email,
                                subject: 'Music Room - Password reset',
                                text: 'Hello,\n\n' + 'Please reset your password by clicking the link: ' +
                                    process.env.SERVER + '\/api\/users\/resetPassword\/' + token.token + '.\n',
                                html: '<html><body><h2>Music Room - You asked for a new password !</h2>' +
                                    '<p>You will be able to reset your password by clicking ' +
                                    '<a href="' + link + '">this link.' +
                                    '</a></p><p>If you\'re not at the origin of this request, please ignore this message.</p></body></html>',
                            };
                            utils.sendMail(mailOptions, resolve, reject);
                        }
                    })
                })
            })
            .catch((error) => {
                reject({
                    status: error.status,
                    msg: error.msg
                })
            })

    })
}

export default {
    getUsers,
    getUserById,
    deleteUserById,
    addUser,
    confirmEmail,
    askPasswordReset,
    sendConfirmEmail,
}
import UserModel from '../models/userModel'
import bcrypt from 'bcrypt';

function login(login, password) {
    // console.log('loginSrv');

    return new Promise((resolve, reject) => {
        UserModel.find({login}, (error, users) => {
            if (error) {
                reject({
                    status: 500,
                    msg: error.msg,
                })
            }
            else if (!users.length) {
                reject({
                    status: 401,
                    msg: 'Unknown Login'
                })
            }
            else {
                if (bcrypt.compareSync(password, users[0].password)) {
                    if (!(users[0].isVerified)) {
                        reject({
                            status: 401,
                            msg: 'User not verified',
                        })
                    }
                    else {
                        resolve({
                            status: 200,
                            data: users[0],
                        })

                    }
                }
                else {
                    reject({
                        status: 401,
                        msg: "Incorrect Password",
                    })
                }
            }
        });
    });
}

export default {
    login,
}
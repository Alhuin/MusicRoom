import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserModel from '../models/userModel';
import TokenModel from '../models/tokenModel';
import utils from '../utils';
import CustomError from './errorHandler';

/*    Fetch    */

function getUsers() {
  return new Promise((resolve, reject) => {
    UserModel.find({}, (error, users) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!users.length) {
        reject(new CustomError('[Get Users] No users in database', 400));
      } else {
        resolve({
          status: 200,
          data: users,
        });
      }
    });
  });
}

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!user) {
        reject(new CustomError('[Get User] No user with this id in database', 400));
      } else {
        resolve({
          status: 200,
          data: user,
        });
      }
    });
  });
}

function deleteUserById(userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!user) {
        reject(new CustomError('[Delete User] No user with this id in database', 400));
      } else {
        user.remove((removeError, removedUser) => {
          if (removeError) {
            reject(new CustomError(removeError, 500));
          } else {
            resolve({
              status: 200,
              data: removedUser,
            });
          }
        });
      }
    });
  });
}

function addUser(login, password, name, familyName, email) {
  return new Promise(async (resolve, reject) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    const user = new UserModel({
      login,
      password: hash,
      name,
      familyName,
      email,
    });
    user.save((error, savedUser) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else {
        _sendEmailToken(savedUser, resolve, reject);
      }
    });
  });
}

function _getUserByLoginOrEmail(loginOrEmail) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ login: loginOrEmail }, (error, userByLogin) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!userByLogin) {
        UserModel.findOne({ email: loginOrEmail }, (findError, userByEmail) => {
          if (findError) {
            reject(new CustomError(findError, 500));
          } else if (!userByEmail) {
            reject(new CustomError('No user with this login or email'), 400);
          } else {
            resolve({
              status: 200,
              data: userByEmail,
            });
          }
        });
      } else {
        resolve({
          status: 200,
          data: userByLogin,
        });
      }
    });
  });
}

/*    User Interface    */

function updatePassword(userId, newPassword) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ _id: userId }, (error, user) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!user) {
        reject(new CustomError('[Update Password] No user with this id', 400));
      } else {
        const updateUser = user;
        updateUser.password = newPassword;
        updateUser.save((saveError, newUser) => {
          if (saveError) {
            reject(new CustomError(saveError, 500));
          } else {
            resolve({
              status: 200,
              data: newUser,
            });
          }
        });
      }
    });
  });
}

/*     Mail Tokens         */

function sendPasswordToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    _getUserByLoginOrEmail(loginOrEmail)
      .then((response) => {
        const user = response.data;
        const token = new TokenModel({
          type: 'resetPassword',
          user: user._id,
          token: crypto.randomBytes(16).toString('hex'),
        });
        token.save((tokenSaveError, savedToken) => {
          if (tokenSaveError) {
            reject(new CustomError(tokenSaveError, 500));
          } else {
            const mailOptions = {
              from: '"MusicRoom Team" <team@musicroom.com>',
              to: user.email,
              subject: 'New Password Request',
              text: `Hello,\n\nYou can reset your password by clicking the link:
              \nhttp://$(SERVER ENV)/users/resetPassword/${savedToken.token}.\n`,
            };
            utils.sendMail(mailOptions, resolve, reject);
          }
        });
      })
      .catch((error) => {
        reject(new CustomError(error, 500));
      });
  });
}

function confirmPasswordToken(tokenString) {
  return new Promise((resolve, reject) => {
    TokenModel.findOne({ token: tokenString }, (error, token) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!token) {
        reject(new CustomError('[Confirm Password Token] Invalid token, it may have expired', 400));
      } else {
        UserModel.findById(token.user, (findError, user) => {
          if (findError) {
            reject(new CustomError(findError, 500));
          } else if (!user) {
            reject(new CustomError('[Confirm Password Token] No user with this token in database', 400));
          } else {
            resolve({
              status: 200,
              data: user,
            });
            // OUVRIR APP POUR SAISIR NEW PW
          }
        });
      }
    });
  });
}

function askEmailToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    _getUserByLoginOrEmail(loginOrEmail)
      .then((response) => {
        const user = response.data;
        _sendEmailToken(user, resolve, reject);
      })
      .catch((findError) => {
        reject(new CustomError(findError, 500));
      });
  });
}

function _sendEmailToken(user, resolve, reject) {
  const token = new TokenModel({
    type: 'confirmEmail',
    user: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  token.save((tokenSaveError, savedToken) => {
    if (tokenSaveError) {
      reject(new CustomError(tokenSaveError, 500));
    } else {
      const mailOptions = {
        from: '"MusicRoom Team" <team@musicroom.com>',
        to: user.email,
        subject: 'Account Verification Token',
        text: `Hello,\n\nPlease verify your account by clicking the link:
              \nhttp://$(SERVER ENV)/users/confirmation/${savedToken.token}.\n`,
      };
      utils.sendMail(mailOptions, resolve, reject);
    }
  });
}

function confirmEmailToken(tokenString) {
  return new Promise((resolve, reject) => {
    TokenModel.findOne({ token: tokenString }, (error, token) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!token) {
        reject(new CustomError('[Confirm Email Token] Invalid token, it may have expired', 400));
      } else {
        UserModel.findById(token.user, (findError, user) => {
          if (findError) {
            reject(new CustomError(findError, 500));
          } else if (!user) {
            reject(new CustomError('[Confirm Email Token] No user with this token in database', 400));
          } else if (user.isVerified) {
            reject(new CustomError('[Confirm Email Token] User is already verified', 400));
          } else {
            const verifiedUser = user;
            verifiedUser.isVerified = true;
            verifiedUser.save((saveError, savedUser) => {
              if (saveError) {
                reject(new CustomError(error, 500));
              } else {
                resolve({
                  status: 200,
                  data: savedUser,
                });
              }
            });
          }
        });
      }
    });
  });
}

export default {
  getUsers,
  getUserById,
  deleteUserById,
  addUser,
  askEmailToken,
  confirmEmailToken,
  sendPasswordToken,
  confirmPasswordToken,
  updatePassword,
};

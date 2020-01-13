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
        reject(new CustomError('MongoError', error.message, 500));
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
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('GetUser', 'No user with this id found in database', 404));
      } else {
        resolve({
          status: 200,
          data: user,
        });
      }
    });
  });
}

function getUserByIdByPreferences(userId, requesterId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('GetUserByIdByPreferences', 'No user with this id found in database', 404));
      } else {
        const newUser = user;
        // let keys;
        // Object.assign(iconFromVisibilityTable, user.visibilityTable);
        Object.keys(user.visibilityTable).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(user.visibilityTable, key)) {
            /* if (user.visibilityTable[key] === 'ALL') {
            } else */
            if (user.visibilityTable[key] === 'PRIVATE') {
              newUser[key] = '';
            } else if (user.visibilityTable[key] === 'FRIEND_ONLY') {
              if (!user.friends.includes(requesterId)) {
                newUser[key] = '';
              }
            }
          }
        });
        resolve({
          status: 200,
          data: newUser,
        });
      }
    });
  });
}

function getFriends(userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('GetFriends', 'No user with this id found in database', 404));
      } else {
        UserModel.find({
          _id: {
            $in: user.friends,
          },
        }, (err, friends) => {
          if (error) {
            reject(new CustomError('MongoError', error.message, 500));
          } else {
            resolve({
              status: 200,
              data: friends,
            });
          }
        });
      }
    });
  });
}

function deleteUserById(userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('DeleteUser', 'No user with this id found in database', 404));
      } else {
        user.remove((removeError, removedUser) => {
          if (removeError) {
            reject(new CustomError('MongoError', removeError.message, 500));
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
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = new UserModel({
      login,
      password: hash,
      name,
      familyName,
      email,
      isVerified: false,
    });
    user.save((error, savedUser) => {
      if (error) {
        if (error.name === 'ValidationError') {
          reject(new CustomError('AddUser', error.message.split(':')[1], 400)); // duplicate
        } else {
          reject(new CustomError('MongoError', error.message, 500));
        }
      } else {
        _sendEmailToken(savedUser, resolve, reject);
      }
    });
  });
}

function updateUser(userId, login, name, familyName, email, phoneNumber, preferences,
  visibilityTable) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('UpdateUser', 'No user with this id found in database', 404));
      } else {
        const updatedUser = user;
        updatedUser.login = login;
        updatedUser.name = name;
        updatedUser.familyName = familyName;
        updatedUser.email = email;
        updatedUser.phoneNumber = phoneNumber;
        updatedUser.preferences = preferences;
        updatedUser.visibilityTable = visibilityTable;
        updatedUser.save((saveError, newUser) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
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

function addFriend(friendId, userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('AddFriend', 'No user with this id found in database', 404));
      } else {
        const updatedUser = user;
        if (!updatedUser.friends.includes(friendId)) {
          updatedUser.friends.push(friendId);
        }
        updatedUser.save((saveError, newUser) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
          } else {
            UserModel.findById(friendId, (errorFriend, friend) => {
              if (error) {
                reject(new CustomError('MongoError', errorFriend.message, 500));
              } else if (!friend) {
                reject(new CustomError('AddFriend', 'No user with this id found in database', 404));
              } else {
                const updatedFriend = friend;
                if (!updatedFriend.friends.includes(userId)) {
                  updatedFriend.friends.push(userId);
                }
                // eslint-disable-next-line no-unused-vars //
                updatedUser.save((saveErrorFriend, newFriend) => {
                  if (saveErrorFriend) {
                    reject(new CustomError('MongoError', saveErrorFriend.message, 500));
                  } else {
                    resolve({
                      status: 200,
                      data: newUser,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

function deleteFriend(friendId, userId) {
  return new Promise((resolve, reject) => {
    UserModel.findById(userId, (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('DeleteFriend', 'No user with this id found in database', 404));
      } else {
        const updatedUser = user;
        if (updatedUser.friends.includes(friendId)) {
          updatedUser.friends.remove(friendId);
        }
        updatedUser.save((saveError, newUser) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
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

function _getUserByLoginOrEmail(loginOrEmail) {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ login: loginOrEmail }, (error, userByLogin) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!userByLogin) {
        UserModel.findOne({ email: loginOrEmail }, (findError, userByEmail) => {
          if (findError) {
            reject(new CustomError('MongoError', findError.message, 500));
          } else if (!userByEmail) {
            reject(new CustomError('UserByLoginOrEmail', 'No user with this login or email found in database'), 404);
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
    UserModel.findOne({ _id: userId }, async (error, user) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!user) {
        reject(new CustomError('UpdatePassword', 'No user with this id found in database', 404));
      } else {
        const updatedUser = user;
        const salt = await bcrypt.genSaltSync(10);
        updatedUser.password = await bcrypt.hashSync(newPassword, salt);
        updatedUser.save((saveError, newUser) => {
          if (saveError) {
            reject(new CustomError('MongoError', saveError.message, 500));
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

/*     Tokens         */

//  Password

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
            reject(new CustomError('MongoError', tokenSaveError.message, 500));
          } else {
            const mailOptions = {
              from: '"MusicRoom Team" <team@musicroom.com>',
              to: user.email,
              subject: 'New Password Request',
              html: `Bonjour !\n\nTu peux réinitialiser ton mot de passe en cliquant sur <a href='${process.env.SERVER}:${process.env.EXPRESS_PORT}/api/users/passToken/${savedToken.token}'>ce lien</a>.`,
            };
            utils.sendMail(mailOptions, resolve, reject);
          }
        });
      })
      .catch((error) => {
        reject(new CustomError(error.name, error.message, error.status));
      });
  });
}

function confirmPasswordToken(tokenString) {
  return new Promise((resolve, reject) => {
    TokenModel.findOne({ token: tokenString }, (error, token) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!token) {
        reject(new CustomError('ConfirmPasswordToken', 'Token not found in database', 404));
      } else {
        UserModel.findById(token.user, (findError, user) => {
          if (findError) {
            reject(new CustomError('MongoError', findError.message, 500));
          } else if (!user) {
            reject(new CustomError('ConfirmPasswordToken', 'No user with this token found in database', 404));
          } else {
            resolve({
              status: 200,
              data: user,
            });
          }
        });
      }
    });
  });
}

//  Email

function askEmailToken(loginOrEmail) {
  return new Promise((resolve, reject) => {
    _getUserByLoginOrEmail(loginOrEmail)
      .then((response) => {
        const user = response.data;
        _sendEmailToken(user, resolve, reject);
      })
      .catch((findError) => {
        reject(new CustomError('MongoError', findError.message, 500));
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
      reject(new CustomError('MongoError', tokenSaveError.message, 500));
    } else {
      const mailOptions = {
        from: '"MusicRoom Team" <team@musicroom.com>',
        to: user.email,
        subject: 'Account Verification',
        html: `Bonjour !\n\nVérifie ton compte en cliquant sur <a href='${process.env.SERVER}:${process.env.EXPRESS_PORT}/api/users/emailToken/${savedToken.token}'>ce lien</a>.`,
      };
      utils.sendMail(mailOptions, resolve, reject);
    }
  });
}

function confirmEmailToken(tokenString) {
  return new Promise((resolve, reject) => {
    TokenModel.findOne({ token: tokenString }, (error, token) => {
      if (error) {
        reject(new CustomError('MongoError', error.message, 500));
      } else if (!token) {
        reject(new CustomError('MailToken', 'Invalid token, it may have expired', 404));
      } else {
        UserModel.findById(token.user, (findError, user) => {
          if (findError) {
            reject(new CustomError('MongoError', findError.message, 500));
          } else if (!user) {
            reject(new CustomError('MailToken', 'No user with this token found in database', 404));
          } else if (user.isVerified) {
            reject(new CustomError('MailToken', 'User is already verified', 400));
          } else {
            const verifiedUser = user;
            verifiedUser.isVerified = true;
            verifiedUser.save((saveError, savedUser) => {
              if (saveError) {
                reject(new CustomError('MongoError', error.message, 500));
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

function getDeezerCode(DeezerCode) {
  console.log(DeezerCode);
  return new Promise((resolve, reject) => {
    if (DeezerCode !== '') {
      resolve({
        status: 200,
        data: DeezerCode,
      });
    } else {
      reject(new CustomError('GetDeezerCode', 'Empty code', 404));
    }
  });
}

export default {
  getUsers,
  getUserById,
  getUserByIdByPreferences,
  deleteUserById,
  addUser,
  askEmailToken,
  confirmEmailToken,
  sendPasswordToken,
  confirmPasswordToken,
  updatePassword,
  updateUser,
  addFriend,
  deleteFriend,
  getFriends,
  getDeezerCode,
};

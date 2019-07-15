import bcrypt from 'bcrypt';
import CustomError from './errorHandler';
import UserModel from '../models/userModel';

function login(userName, password) {
  return new Promise((resolve, reject) => {
    UserModel.find({ login: userName }, (error, users) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else if (!users.length) {
        reject(new CustomError('Unknown login', 401));
      } else if (bcrypt.compareSync(password, users[0].password)) {
        if (!(users[0].isVerified)) {
          reject(new CustomError('User not verified', 401));
        } else {
          resolve({
            status: 200,
            data: users[0],
          });
        }
      } else {
        reject(new CustomError('Incorrect password', 401));
      }
    });
  });
}

export default {
  login,
};

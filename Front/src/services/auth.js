import AsyncStorage from '@react-native-community/async-storage';
import { getUserById } from '../../API/BackApi';

export const onSignIn = (user) => AsyncStorage.setItem('loggedUser', user);

export const onSignOut = () => AsyncStorage.removeItem('loggedUser');

export const isSignedIn = () => new Promise((resolve, reject) => {
  // alert('IsSignedIn Func');
  AsyncStorage.getItem('loggedUser')
    .then((res) => {
      if (res) {
        const user = JSON.parse(res);
        getUserById(user._id)
          .then((foundUser) => {
            resolve(foundUser);
          })
          .catch((error) => {
            reject(error); // On renvoie la CustomError de GetUserById
          });
      } else {
        resolve(false); // pas de user dans asyncstorage
      }
    })
    .catch((err) => {
      reject(err);
    });
});

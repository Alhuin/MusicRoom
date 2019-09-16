import AsyncStorage from '@react-native-community/async-storage';
import { getUserById } from '../../API/BackApi';

export const onSignIn = user => AsyncStorage.setItem('loggedUser', user);

export const onSignOut = () => AsyncStorage.removeItem('loggedUser');

export const isSignedIn = () => new Promise((resolve, reject) => {
  // alert('IsSignedIn Func');
  AsyncStorage.getItem('loggedUser')
    .then((res) => {
      if (res) {
        console.log(res);
        const user = JSON.parse(res);
        getUserById(user._id)
          .then((foundUser) => {
            resolve(foundUser);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve(false); // a revoir
      }
    })
    .catch((err) => {
      reject(err);
    });
});

import AsyncStorage from '@react-native-community/async-storage';
import { getUserById } from '../../API/BackApi';

export const onSignIn = user => AsyncStorage.setItem('loggedUser', user);

export const onSignOut = () => AsyncStorage.removeItem('loggedUser');

export const isSignedIn = () => new Promise((resolve, reject) => {
  AsyncStorage.getItem('loggedUser')
    .then((res) => {
      if (res) {
        // console.log(JSON.parse(res));
        const user = JSON.parse(res);
        getUserById(user._id)
          .then((response) => {
            // console.log("isValidId telling its : " + response);
            if (response) {
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            // console.log('error in auth + ' + error.msg);
            reject(error);
          });
      } else {
        // console.log('no logged user');
        resolve(false);
      }
    })
    .catch(err => reject(err));

/*  AsyncStorage.getItem('loggedUser')
    .then((res) => {
      resolve(res);
    })
    .catch(err => reject(err));*/
});

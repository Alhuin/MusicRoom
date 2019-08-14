import AsyncStorage from '@react-native-community/async-storage';

export const onSignIn = user => AsyncStorage.setItem('loggedUser', user);

export const onSignOut = () => AsyncStorage.removeItem('loggedUser');

export const isSignedIn = () => new Promise((resolve, reject) => {
  AsyncStorage.getItem('loggedUser')
    .then((res) => {
      // console.log('isSignedIn: ');
      // console.log(res);
      resolve(res);
    })
    .catch(err => reject(err));
});

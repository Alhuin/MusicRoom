import {
  View, StyleSheet, Alert, Button,
} from 'react-native';
import React, { Component } from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import SocketIOClient from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { addUser, login } from '../../../API/BackApi';


export default class SocialLogin extends Component {
  signIn = async () => {
    console.log('CHECKER');
    const { type } = this.props;
    if (type === 'Sign Up' && await AsyncStorage.getItem('type') === null) {
      GoogleSignin.configure({
        webClientId: '846991476431-n04g8tt0rlgqlf40n93j93ehapdh6rtm.apps.googleusercontent.com',
      });
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        addUser(userInfo.user.familyName, userInfo.idToken,
          userInfo.user.givenName, userInfo.user.familyName, userInfo.user.email)
          .then(await AsyncStorage.setItem('userName', userInfo.user.familyName),
            await AsyncStorage.setItem('password', userInfo.idToken),
            await AsyncStorage.setItem('type', 'SignIn'))
          .catch((errror) => {
            console.log('caught', errror.message);
          });
      } catch (error) {
        console.log(`4 :${error.code}`);
      }
    }
  };

  signInn = async () => {
    const {
      navigation, userChanged, setSocket, admin,
    } = this.props;
    const loginSocial = await AsyncStorage.getItem('userName');
    const passSocial = await AsyncStorage.getItem('password');
    login(loginSocial, passSocial)
      .then((user) => {
        console.log('ALLER');
        userChanged(user);
        if (user.isAdmin) {
          admin(true);
        }
        setSocket(SocketIOClient('http://10.4.4.4:4000'));
        console.log('ALLER');
        navigation.navigate('app');
        console.log('ALLERRRRR');
      })
      .catch((error) => {
        if (error.status === 401) {
          Alert.alert('Error, wrong username or password');
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
        />
        <Button
          title="google"
          style={{ width: 48, height: 48 }}
          onPress={this.signInn}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

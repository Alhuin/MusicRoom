import {
  View, StyleSheet, Alert,
} from 'react-native';
import React, { Component } from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import SocketIOClient from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import { addUser, login } from '../../../API/BackApi';


export default class SocialLogin extends Component {

  signIn = async () => {
    const {
      type,
      navigation,
      userChanged,
      setSocket,
      admin,
    } = this.props;
    const loginSocial = await AsyncStorage.getItem('userName');
    const passSocial = await AsyncStorage.getItem('password');

    console.log(`propsType = ${type}`);
    console.log(`asyncType = ${await AsyncStorage.getItem('type')}`);

    if (type === 'Sign Up' && await AsyncStorage.getItem('type') === null) {
      GoogleSignin.configure({
        webClientId: '1032045608110-fk8aiqduat8c6oiltm1uneqbuqhumfsn.apps.googleusercontent.com',
      });
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();

        addUser(userInfo.user.familyName, userInfo.idToken,
          userInfo.user.givenName, userInfo.user.familyName, userInfo.user.email)
          .then(
            await AsyncStorage.setItem('userName', userInfo.user.familyName),
            await AsyncStorage.setItem('password', userInfo.idToken),
            await AsyncStorage.setItem('type', 'SignIn'),
            console.log('Alert'),
            Alert.alert(
              'Validation de compte',
              'Un email de vérification vous a été envoyé.',
            ),
          )
          .catch((error) => {
            console.log('caught', error.message);
          });
      } catch (error) {
        console.error(error);
      }
    } else if (await AsyncStorage.getItem('type') === 'SignIn') {
      login(loginSocial, passSocial)
        .then((user) => {
          userChanged(user);
          if (user.isAdmin) {
            admin(true);
          }
          setSocket(SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`));
          navigation.navigate('app');
        })
        .catch((error) => {
          if (error.status === 401) {
            Alert.alert('Error, wrong username or password');
          }
        });
    }
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

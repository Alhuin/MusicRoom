import {
  View, StyleSheet, Alert,
} from 'react-native';
import React, { Component } from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import SocketIOClient from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import { addUser, findUserByidSocial } from '../../../API/BackApi';


export default class SocialLogin extends Component {
  signIn = async () => {
    const {
      navigation,
      userChanged,
      setSocket,
    } = this.props;
    GoogleSignin.configure({
      webClientId: '1032045608110-fk8aiqduat8c6oiltm1uneqbuqhumfsn.apps.googleusercontent.com',
    });

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      findUserByidSocial(userInfo.user.id, 'Google')
        .then((res) => {
          const socket = SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`);
          socket.connect();
          setSocket(socket);
          userChanged(res);
          navigation.navigate('app');
        })
        .catch((idGoogleerror) => {
          if (idGoogleerror.status === 404) {
            addUser(userInfo.user.familyName, userInfo.user.id + userInfo.user.familyName,
              userInfo.user.givenName, userInfo.user.familyName, userInfo.user.email, '', userInfo.user.id)
              .then(async () => {
                await AsyncStorage.setItem('log', 'autoLog');
                await AsyncStorage.setItem('pass', userInfo.user.id + userInfo.user.familyName);
                await AsyncStorage.setItem('login', userInfo.user.familyName);
                Alert.alert(
                  'Validation de compte',
                  'Un email de vérification vous a été envoyé.',
                );
              })
              .catch(async (error) => {
                if (error.status === 400) { // validation error
                  Alert.alert(
                    'Inscription',
                    `Un compte avec ${error.msg === ' login' ? 'ce login' : 'cet email'} existe déjà !`,
                  );
                  await GoogleSignin.signOut();
                } else {
                  console.log(error);
                }
              });
          } else {
            console.log(idGoogleerror);
          }
        });
    } catch (error) {
      console.log(error);
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

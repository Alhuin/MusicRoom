import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import Components from '../components';
import { addUser, findUserByidSocial } from '../../API/BackApi';
import { getDeezerTokenLogin } from '../../API/DeezerApi';

class Inscription extends React.Component {
  render() {
    const type = 'Sign Up';
    const {
      navigation, userChanged, setSocket, admin,
    } = this.props;
    const DeezerCode = navigation.getParam('DeezCode');

    userChanged(null);
    admin(false);
    if (DeezerCode) {
      getDeezerTokenLogin(DeezerCode)
        .then((response) => {
          findUserByidSocial(response.id.toString(), 'Deezer')
            .then((res) => {
              const socket = SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`);
              socket.connect();
              setSocket(socket);
              userChanged(res);
              navigation.navigate('app');
            })
            .catch((idDeezError) => {
              if (idDeezError.status === 404) {
                addUser(response.firstname, response.id.toString() + response.lastname,
                  response.firstname, response.lastname, response.email, response.id.toString())
                  .then(async () => {
                    Alert.alert(
                      'Validation de compte',
                      'Un email de vérification vous a été envoyé.',
                    );
                    await AsyncStorage.setItem('log', 'autoLog');
                    await AsyncStorage.setItem('pass', response.id.toString());
                    await AsyncStorage.setItem('login', response.firstname);
                  })
                  .catch((error) => {
                    if (error.status === 400) { // validation error
                      Alert.alert(
                        'Inscription',
                        `Un compte avec ${error.msg === ' login' ? 'ce login' : 'cet email'} existe déjà !`,
                      );
                      // TODO Si ca pète (eg validation error),
                      //  pouvoir resélectionner un compte, pas tenter a nouveau le addUser
                      //  sinon on est kéblo
                    } else {
                      console.log(error);
                    }
                  });
              } else {
                console.log(idDeezError);
              }
            });
        })
        .catch(error => console.log(error));
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            <Components.Logo />
            <Components.SignUpForm />
            <Components.SocialLogin
              type={type}
              navigation={navigation}
              userChanged={userChanged}
              setSocket={setSocket}
              admin={admin}
            />
            <Components.DeezerLogin
              type={type}
              navigation={navigation}
              userChanged={userChanged}
              setSocket={setSocket}
              admin={admin}
            />
            <Components.LoginContext
              navigation={navigation}
              type={type}
              style={styles.loginContext}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollView: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

export default Inscription;

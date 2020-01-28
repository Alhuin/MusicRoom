import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, View, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import SignInForm from '../containers/SignInForm';
import { login } from '../../API/BackApi';
import Components from '../components';
import { Colors } from '../styles';

class Connexion extends React.Component {
  async componentDidMount(): void {
    // passer dans redux les globales comme ca on esquive l'async sur CDM
    const {
      navigation, userChanged, admin, setSocket,
    } = this.props;

    const pass = await AsyncStorage.getItem('pass');
    const log = await AsyncStorage.getItem('log');
    const loging = await AsyncStorage.getItem('login');
    if (log === 'autoLog') {
      login(loging, pass)
        .then(async (user) => {
          userChanged(user);
          if (user.isAdmin) {
            admin(true);
          }
          setSocket(SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`));
          await AsyncStorage.setItem('log', '');
          await AsyncStorage.setItem('pass', '');
          await AsyncStorage.setItem('login', '');
          navigation.navigate('app');
        })
        .catch((error) => {
          // console.log(error);
          if (error.status === 401) {
            Alert.alert('Erreur d\'authentification', 'Mauvais identifiant ou mot de passe.');
          } else if (error.status === 403) {
            Alert.alert(
              'Erreur d\'authentification',
              'Votre adresse email n\'a pas été vérifiée.',
            );
          }
        });
    }
  }

  render() {
    const {
      navigation, userChanged, setSocket, admin,
    } = this.props;
    const type = 'Sign In';

    return (
      <KeyboardAvoidingView
        style={styles.main_container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={100}
      >
        <View
          style={styles.view}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Components.Logo />
            <SignInForm navigation={navigation} />
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
              type={type}
              navigation={navigation}
              style={styles.loginContext}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
  },
  view: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

export default Connexion;

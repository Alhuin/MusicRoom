import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, View, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import Logo from '../components/Authentication/Logo';
import LoginContext from '../components/Authentication/LoginContext';
import SignInForm from '../containers/SignInForm';
import { login } from '../../API/BackApi';


class Connexion extends React.Component {
  async componentDidMount(): void {
    const {
      navigation, userChanged, admin, setSocket,
    } = this.props;
    const pass = await AsyncStorage.getItem('pass');
    const log = await AsyncStorage.getItem('log');
    const loging = await AsyncStorage.getItem('login');
    if (log === 'autoLog') {
      login(loging, pass)
        .then((user) => {
          userChanged(user);
          if (user.isAdmin) {
            admin(true);
          }
          setSocket(SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`));
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
    const { navigation } = this.props;
    const type = 'Sign In';

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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Logo />
            <SignInForm navigation={navigation} />
            <LoginContext
              type={type}
              navigation={navigation}
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

export default Connexion;

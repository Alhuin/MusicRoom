import React from 'react';
import {
  StyleSheet, View, Alert, SafeAreaView, ScrollView,
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import SignInForm from '../containers/SignInForm';
import { login } from '../../API/BackApi';
import Components from '../components';
import { Colors } from '../styles';

class Connexion extends React.Component {
  componentDidMount(): void {
    // passer dans redux les globales comme ca on esquive l'async sur CDM
    const {
      navigation, userChanged, admin, setSocket, tmpLogUser, logPassLogin,
    } = this.props;
    if (tmpLogUser !== null) {
      const { pass, loging } = tmpLogUser;
      login(loging, pass)
        .then((user) => {
          userChanged(user);
          if (user.isAdmin) {
            admin(true);
          }
          const socket = SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`, { query: `userId=${user._id}` });
          socket.connect();
          setSocket(socket);
          logPassLogin(null);
          navigation.navigate('app');
        })
        .catch((error) => {
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
      navigation, userChanged, setSocket, admin, logPassLogin,
    } = this.props;
    const type = 'Sign In';
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.screenHeader }}>
        <ScrollView
          style={styles.main_container}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={styles.view}
            showsVerticalScrollIndicator={false}
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
                logPassLogin={logPassLogin}
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
        </ScrollView>
      </SafeAreaView>
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

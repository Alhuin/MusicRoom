import React from 'react';
import {
  StyleSheet, View, Alert, SafeAreaView, ScrollView,
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import Components from '../components';
import { addUser, findUserByidSocial } from '../../API/BackApi';
import { getDeezerTokenLogin } from '../../API/DeezerApi';
import { Colors } from '../styles';


class Inscription extends React.Component {
  render() {
    const type = 'Sign Up';
    const {
      navigation, userChanged, setSocket, admin, logPassLogin,
    } = this.props;
    let DeezerCode = navigation.getParam('DeezCode');

    userChanged(null);
    admin(false);
    if (DeezerCode) {
      getDeezerTokenLogin(DeezerCode)
        .then((response) => {
          findUserByidSocial(response.id.toString(), 'Deezer')
            .then((res) => {
              userChanged(res);
              const socket = SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`, { query: `userId=${res._id}` });
              // socket.connect();
              setSocket(socket);
              navigation.navigate('app');
            })
            .catch((idDeezError) => {
              if (idDeezError.status === 404) {
                addUser(response.firstname, response.id.toString() + response.lastname,
                  response.firstname, response.lastname, response.email, response.id.toString(), '')
                  .then(async () => {
                    Alert.alert(
                      'Validation de compte',
                      'Un email de vérification vous a été envoyé.',
                    );
                    logPassLogin({ pass: response.id.toString(), loging: response.firstname });
                  })
                  .catch((error) => {
                    if (error.status === 400) { // validation error
                      Alert.alert(
                        'Inscription',
                        `Un compte avec ${error.msg === ' login' ? 'ce login' : 'cet email'} existe déjà !`,
                      );
                      DeezerCode = null;
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
              <Components.SignUpForm navigation={navigation} />
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
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

export default Inscription;

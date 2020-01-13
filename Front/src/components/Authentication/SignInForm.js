import React from 'react';
import {
  Button, Keyboard, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert,
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import { login } from '../../../API/BackApi';

export default class SignInForm extends React.Component {
  state = {
    password: '',
    userName: '',
  };

  updateLogin = (text) => {
    this.setState({ userName: text });
  };

  updatePassword = (text) => {
    this.setState({ password: text });
  };

  SignIn = () => {
    const {
      userName, password,
    } = this.state;
    const {
      navigation, userChanged, admin, setSocket,
    } = this.props;
    if (!(userName.length && password.length)) {
      Alert.alert(
        'Connexion',
        'Veuillez remplir tous les champs.',
      );
    } else {
      login(userName, password)
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
            Alert.alert('Erreur d\'authentification', 'Mauvais identifiant ou mot de passe.');
          } else if (error.status === 403) {
            Alert.alert(
              'Erreur d\'authentification',
              'Votre adresse email n\'a pas été vérifiée.',
            );
          }
        });
    }
  };

  sendTokensPage = (type) => {
    const { navigation } = this.props;
    navigation.navigate('SendTokens', { type });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={this.updateLogin}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Identifiant"
        />
        <TextInput
          onChangeText={this.updatePassword}
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Mot de passe"
          secureTextEntry
        />
        <View
          style={styles.submitButton}
        >
          <Button
            title="Sign In"
            onPress={() => {
              Keyboard.dismiss();
              this.SignIn();
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.forgotPass}
          onPress={() => this.sendTokensPage('password')}
        >
          <Text>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.forgotPass}
          onPress={() => this.sendTokensPage('mail')}
        >
          <Text>Compte non vérifié ?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: 300,
  },
  inputBox: {
    width: 300,
  },
  submitButton: {
    width: 150,
  },
  forgotPass: {
    paddingTop: 10,
  },
});

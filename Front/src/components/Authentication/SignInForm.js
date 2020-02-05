import React from 'react';
import {
  Keyboard, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert,
} from 'react-native';
import SocketIOClient from 'socket.io-client';
import { SERVER, WEBSOCKET_PORT } from 'react-native-dotenv';
import { login } from '../../../API/BackApi';
import { Typography, Buttons, Colors } from '../../styles';

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
          const socket = SocketIOClient(`${SERVER}:${WEBSOCKET_PORT}`);
          // console.log(`socket connected = ${socket} on address ${SERVER}:${WEBSOCKET_PORT}`);
          socket.connect();
          setSocket(socket);
          navigation.navigate('app');
        })
        .catch((error) => {
          if (error.status === 401) {
            Alert.alert(
              'Erreur d\'authentification',
              'Mauvais identifiant ou mot de passe.',
            );
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
      <View style={Typography.section}>
        <View style={Typography.sectionHeader}>
          <Text style={Typography.sectionHeaderText}>
            Identification
          </Text>
        </View>
        <View style={Typography.sectionContent}>
          <TextInput
            onChangeText={this.updateLogin}
            autoCorrect={false}
            autoCapitalize="none"
            style={Typography.textInput}
            placeholder="Identifiant"
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            onChangeText={this.updatePassword}
            style={Typography.textInput}
            placeholder="Mot de passe"
            secureTextEntry
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                this.SignIn();
              }}
              style={Buttons.largeButton}
            >
              <Text style={Buttons.text}>
                Connexion
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPass}
            onPress={() => this.sendTokensPage('password')}
          >
            <Text style={Typography.bodyText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPass}
            onPress={() => this.sendTokensPage('mail')}
          >
            <Text style={Typography.bodyText}>Compte non vérifié ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotPass: {
    paddingTop: 10,
    width: '100%',
    alignItems: 'center',
  },
});

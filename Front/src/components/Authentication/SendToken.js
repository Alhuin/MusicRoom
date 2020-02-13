import React from 'react';
import {
  View, TextInput, Keyboard, Alert, TouchableOpacity, Text,
} from 'react-native';
import { sendPasswordToken, sendEmailToken } from '../../../API/BackApi';
import { Buttons, Colors, Typography } from '../../styles';

export default class SendToken extends React.Component {
  state = {
    loginOrEmail: '',
  };

  _updateLoginOrEmail = (text) => {
    this.setState({ loginOrEmail: text });
  };

  _submitAction = () => {
    const { type } = this.props;
    const { loginOrEmail } = this.state;

    if (!loginOrEmail.length) {
      Alert.alert('Votre login ou votre email est requis.');
    } else if (type === 'password') {
      sendPasswordToken(loginOrEmail)
        .then(() => Alert.alert(
          'Mot de passe perdu',
          'Un email contenant les instructions de réinitialisation du mot de passe vous a été envoyé.',
        ))
        .catch(() => Alert.alert(
          'Mot de passe perdu',
          'Une erreur est survenue lors de l\'envoi du mail, veuillez réessayer plus tard.',
        ));
    } else if (type === 'mail') {
      sendEmailToken(loginOrEmail)
        .then(() => Alert.alert(
          'Validation du compte',
          'Un email de validation vous a été envoyé.',
        ))
        .catch(() => Alert.alert(
          'Validation du compte',
          'Une erreur est survenue lors de l\'envoi du mail, veuillez réessayer plus tard.',
        ));
    }
  };

  render() {
    return (
      <View style={Typography.section}>
        <TextInput
          onChangeText={this._updateLoginOrEmail}
          autoCorrect={false}
          autoCapitalize="none"
          style={Typography.textInput}
          placeholder="Identifiant ou mail"
          placeholderTextColor={Colors.baseText}
        />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              this._submitAction();
            }}
            style={Buttons.largeButton}
          >
            <Text style={Buttons.text}>
              Envoi Mail
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

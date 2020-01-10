import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard, Alert,
} from 'react-native';
import { sendPasswordToken, sendEmailToken } from '../../../API/BackApi';

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
      <View style={styles.container}>
        <TextInput
          onChangeText={this._updateLoginOrEmail}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Login or email"
        />
        <View style={styles.submitButton}>
          <Button
            title="Send email"
            onPress={() => {
              Keyboard.dismiss();
              this._submitAction();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

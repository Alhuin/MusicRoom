import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard, Alert,
} from 'react-native';
import NavigationUtils from '../../navigation/NavigationUtils';
import { updatePassword } from '../../../API/BackApi';

export default class UpdatePassForm extends React.Component {
  state = {
    newPass: '',
    newPassConfirm: '',
  };

  updateNewPass = (text) => {
    this.setState({ newPass: text });
  };

  updateNewPassConfirm = (text) => {
    this.setState({ newPassConfirm: text });
  };

  updatePassword() {
    const { newPass, newPassConfirm } = this.state;
    const { userId } = this.props;
    if (!(newPass.length && newPassConfirm.length)) {
      Alert.alert('Mise à jour du mot de passe', 'Veuillez entrer et confirmer votre nouveau mot de passe.');
    } else if (newPass !== newPassConfirm) {
      Alert.alert('Mise à jour du mot de passe', 'Le mot de passe et sa confirmation doivent être identiques.');
    } else if (userId === undefined) {
      Alert.alert('Mise à jour du mot de passe', 'Votre token a expiré, veuillez demander un nouveau lien.');
    } else {
      updatePassword(userId, newPass)
        .then(() => NavigationUtils.resetStack(this, 'Connexion', { toast: 'Password Updated' }))
        .catch((error) => {
          console.error(error);
          NavigationUtils.resetStack(this, 'Connexion', { toast: 'An error occured, please try again later' });
          // TODO: toujours utile si on gere bien la stack ?
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          secureTextEntry
          onChangeText={this.updateNewPass}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="New password"
        />
        <TextInput
          secureTextEntry
          onChangeText={this.updateNewPassConfirm}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Confirm new password"
        />
        <View style={styles.submitButton}>
          <Button
            title="Update Password"
            onPress={() => {
              Keyboard.dismiss();
              this.updatePassword();
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

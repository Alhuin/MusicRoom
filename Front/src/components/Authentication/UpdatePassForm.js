import React from 'react';
import {
  View, TextInput, TouchableOpacity, Keyboard, Alert, Text,
} from 'react-native';
import NavigationUtils from '../../navigation/NavigationUtils';
import { updatePassword } from '../../../API/BackApi';
import { Typography, Buttons, Colors } from '../../styles';

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
      <View style={Typography.section}>
        <View style={Typography.sectionContent}>
          <TextInput
            secureTextEntry
            onChangeText={this.updateNewPass}
            autoCorrect={false}
            autoCapitalize="none"
            style={Typography.textInput}
            placeholder="Nouveau mot de passe"
            placeholderTextColor={Colors.baseText}
          />
          <TextInput
            secureTextEntry
            onChangeText={this.updateNewPassConfirm}
            autoCorrect={false}
            autoCapitalize="none"
            style={Typography.textInput}
            placeholder="Confirmation"
            placeholderTextColor={Colors.baseText}
          />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                this.updatePassword();
              }}
              style={Buttons.largeButton}
            >
              <Text style={Buttons.text}>
                Mettre à jour
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

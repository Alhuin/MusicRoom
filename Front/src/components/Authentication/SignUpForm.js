import React from 'react';

import {
  Keyboard, View, TextInput, Alert, Text, TouchableOpacity,
} from 'react-native';
import { addUser } from '../../../API/BackApi';
import { Typography, Buttons, Colors } from '../../styles';

export default class SignUpForm extends React.Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    name: '',
    familyName: '',
  };

  updateLogin = (text) => {
    this.setState({ userName: text });
  };

  updatePassword = (text) => {
    this.setState({ password: text });
  };

  updateConfirmPassword = (text) => {
    this.setState({ confirmPassword: text });
  };

  updateName = (text) => {
    this.setState({ name: text });
  };

  updateFamilyName = (text) => {
    this.setState({ familyName: text });
  };

  updateEmail = (text) => {
    this.setState({ email: text });
  };

  SignUp = () => {
    const {
      userName, password, name, familyName, email, confirmPassword,
    } = this.state;

    if (!(name.length && familyName.length && email.length
      && confirmPassword.length && userName.length && password.length)) {
      Alert.alert(
        'Inscription',
        'Veuillez remplir tous les champs.',
      );
    } else if (password !== confirmPassword) {
      Alert.alert(
        'Inscription',
        'Les deux mots de passes ne correspondent pas',
      );
    } else {
      addUser(userName, password, name, familyName, email)
        .then(() => {
          Alert.alert(
            'Bienvenue !',
            'Un email de validation vous a été envoyé.',
          );
        })
        .catch((error) => {
          if (error.status === 400) { // validation error
            Alert.alert(
              'Inscription',
              `Un compte avec ${error.msg === ' login' ? 'ce login' : 'cet email'} existe déjà !`,
            );
          } else {
            console.log(error);
          }
        });
    }
  };

  render() {
    return (
      <View style={Typography.section}>
        <View style={Typography.sectionHeader}>
          <Text style={Typography.sectionHeaderText}>
            Inscription
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
          <TextInput
            onChangeText={this.updateConfirmPassword}
            secureTextEntry
            style={Typography.textInput}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TextInput
            onChangeText={this.updateName}
            autoCorrect={false}
            style={Typography.textInput}
            placeholder="Nom"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TextInput
            onChangeText={this.updateFamilyName}
            autoCorrect={false}
            style={Typography.textInput}
            placeholder="Nom de famille"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TextInput
            onChangeText={this.updateEmail}
            autoCorrect={false}
            autoCapitalize="none"
            keyboard-type="email-address"
            style={Typography.textInput}
            placeholder="Email"
            placeholderTextColor={Colors.placeholder}
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
                this.SignUp();
              }}
              style={Buttons.largeButton}
            >
              <Text style={Buttons.text}>
                Inscription
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

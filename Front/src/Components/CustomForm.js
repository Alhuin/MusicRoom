import React from 'react';

import {
  Button, Keyboard, View, StyleSheet, TextInput,
} from 'react-native';

import { login, addUser } from '../../API/Api';

export default class CustomForm extends React.Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    name: '',
    familyName: '',
  };

  // updateState = (key, value) => {
  //   this.setState({ [key]: value });
  // };

  updateLogin = (text) => {
    console.log(text);
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

  submitAction = () => {
    const {
      userName, password,
    } = this.state;
    const { type } = this.props;
    if (!(userName.length && password.length)) {
      alert('error, empty field.');
      console.log('error, empty field');
    } else if (type === 'Sign Up') {
      const {
        name, familyName, email, confirmPassword,
      } = this.state;

      if (!(name.length && familyName.length && email.length && confirmPassword.length)) {
        alert('error, empty field.');
        console.log('error, empty field');
      } else if (password !== confirmPassword) {
        alert('error, passwords don\'t match');
        console.log('error, passwords don\'t match');
      } else {
        addUser(userName, password, name, familyName, email);
      }
    } else if (type === 'Sign In') {
      login(userName, password);
    }
  };

  render() {
    let nameInput = null;
    let familyNameInput = null;
    let emailInput = null;
    let passwordConfirmInput = null;
    const { type } = this.props;
    if (type === 'Sign Up') {
      passwordConfirmInput = (
        <TextInput
          onChangeText={this.updateConfirmPassword}
          underlineColorAndroid="grey"
          secureTextEntry
          style={styles.inputBox}
          placeholder="Confirm password"
        />
      );
      nameInput = (
        <TextInput
          onChangeText={this.updateName}
          autoCorrect={false}
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Name"
        />
      );
      familyNameInput = (
        <TextInput
          onChangeText={this.updateFamilyName}
          autoCorrect={false}
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Family Name"
        />
      );
      emailInput = (
        <TextInput
          onChangeText={this.updateEmail}
          autoCorrect={false}
          autoCapitalize="none"
          keyboard-type="email-address"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Email"
        />
      );
    }

    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={this.updateLogin}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Login"
        />
        <TextInput
          onChangeText={this.updatePassword}
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Password"
          secureTextEntry
        />
        {passwordConfirmInput}
        {nameInput}
        {familyNameInput}
        {emailInput}
        <View style={styles.submitButton}>
          <Button
            title={type}
            onPress={() => {
              Keyboard.dismiss();
              this.submitAction();
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
});

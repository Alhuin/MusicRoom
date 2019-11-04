import React from 'react';

import {
  Button, Keyboard, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert,
} from 'react-native';
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
    const { navigation, userChanged, admin } = this.props;
    if (!(userName.length && password.length)) {
      Alert.alert('Error, empty field.');
      console.log('error, empty field');
    } else {
      login(userName, password)
        .then((user) => {
          userChanged(user);
          if (user.isAdmin) {
            admin(true);
          }
          navigation.navigate('app');
          console.log(user);
        })
        .catch((error) => {
          // console.log('error');
          // console.log(error);
          if (error.status === 401) {
            Alert.alert('Error, wrong username or password');
          }
        });
    }
  };

  ForgotPassPage = () => {
    const { navigation } = this.props;
    navigation.navigate('SendTokens');
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
          placeholder="Login"
        />
        <TextInput
          onChangeText={this.updatePassword}
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="Password"
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
          onPress={this.ForgotPassPage}
        >
          <Text>Forgot your password ? Click here</Text>
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

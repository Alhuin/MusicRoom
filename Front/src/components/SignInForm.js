import React from 'react';

import {
  Button, Keyboard, View, StyleSheet, TextInput, TouchableOpacity, Text,
} from 'react-native';
import { login } from '../../API/BackApi';
import { isSignedIn, onSignIn } from '../services/auth';

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
    const { navigation } = this.props;
    if (!(userName.length && password.length)) {
      alert('error, empty field.');
      console.log('error, empty field');
    } else {
      login(userName, password)
        .then((user) => {
          // console.log(user);
          onSignIn(JSON.stringify(user))
            .then(() => {
              isSignedIn()
                .then((userSignedIn) => {
                  if (userSignedIn) {
                    global.user = userSignedIn;
                    navigation.navigate('app');
                    // alert(global.user._id);
                  } else {
                    navigation.navigate('auth');
                  }
                })
                .catch(error => alert(error + ' [isSignedIn]'));
            })
            .catch(error => alert(error + ' [onSignIn]'));
          // navigation.navigate('HomePage', { user });
        })
        .catch((error) => {
          if (error.status === 401) {
            alert(error.msg);
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

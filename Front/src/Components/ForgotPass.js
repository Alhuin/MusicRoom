import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard,
} from 'react-native';
import { sendEmailToken } from '../../API/Api';

export default class ForgotPass extends React.Component {
  state = {
    loginOrEmail: '',
  };

  _updateLoginOrEmail = (text) => {
    this.setState({ loginOrEmail: text });
  };


  _submitAction = () => {
    const { loginOrEmail } = this.state;

    if (!loginOrEmail.length) {
      alert('Please enter your email or login');
    } else {
      sendEmailToken(loginOrEmail);
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

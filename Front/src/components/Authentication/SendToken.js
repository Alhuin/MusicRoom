import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard,
} from 'react-native';
import { sendPasswordToken } from '../../../API/BackApi';

export default class SendToken extends React.Component {
  state = {
    loginOrEmail: '',
  };

  _updateLoginOrEmail = (text) => {
    this.setState({ loginOrEmail: text });
  };

  _submitAction = () => {
    const { type } = this.props;
    if (type === 'Forgot Pass') {
      const { loginOrEmail } = this.state;

      if (!loginOrEmail.length) {
        alert('Please enter your email or login');
      } else {
        sendPasswordToken(loginOrEmail);
      }
    } else {
      //  coucou
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
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: 300,
    // borderWidth: 1,                LAISSEZ LES
    // borderColor: 'red',
  },
  inputBox: {
    width: 300,
  },
  submitButton: {
    width: 150,
  },
});

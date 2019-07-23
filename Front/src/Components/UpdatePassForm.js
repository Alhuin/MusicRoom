import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard,
} from 'react-native';
import { updatePassword } from '../../API/Api';

export default class UpdatePassForm extends React.Component {
  state = {
    newPass: '',
    newPassConfirm: '',
    userId: '',
  };

  _updateNewPass = (text) => {
    this.setState({ newPass: text });
  };

  _updateNewPassConfirm = (text) => {
    this.setState({ newPassConfirm: text });
  };

  _updatePassword() {
    const { newPass, newPassConfirm, userId } = this.state;
    if (!(newPass.length && newPassConfirm.length)) {
      alert('error: Empty input');
    } else if (newPass !== newPassConfirm) {
      alert('error: Passwords don\'t match');
    } else {
      updatePassword(userId, newPass);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={this._updateNewPass}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="New password"
        />
        <TextInput
          onChangeText={this._updateNewPassConfirm}
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
              this._updatePassword();
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
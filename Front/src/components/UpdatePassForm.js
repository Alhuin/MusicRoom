import React from 'react';
import {
  StyleSheet, View, TextInput, Button, Keyboard,
} from 'react-native';
import NavigationUtils from '../navigation/NavigationUtils';
import { updatePassword } from '../../API/BackApi';

export default class UpdatePassForm extends React.Component {
  state = {
    newPass: '',
    newPassConfirm: '',
  };

  _updateNewPass = (text) => {
    this.setState({ newPass: text });
  };

  _updateNewPassConfirm = (text) => {
    this.setState({ newPassConfirm: text });
  };

  _updatePassword() {
    console.log(this.props);
    const { newPass, newPassConfirm } = this.state;
    const { userId } = this.props;
    // console.log(`userId = ${userId}`);
    if (!(newPass.length && newPassConfirm.length)) {
      alert('error: Empty input');
    } else if (newPass !== newPassConfirm) {
      alert('error: Passwords don\'t match');
    } else if (userId === undefined) {
      alert('Could not update your password, please ask for a new link.');
    } else {
      updatePassword(userId, newPass)
        .then(() => NavigationUtils.resetStack(this, 'Connexion', { toast: 'Password Updated' }))
        .catch((error) => {
          console.error(error);
          NavigationUtils.resetStack(this, 'Connexion', { toast: 'An error occured, please try again later' });
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          secureTextEntry
          onChangeText={this._updateNewPass}
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="grey"
          style={styles.inputBox}
          placeholder="New password"
        />
        <TextInput
          secureTextEntry
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

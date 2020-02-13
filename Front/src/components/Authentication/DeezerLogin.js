import {
  View, StyleSheet, Linking, Text, TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import { Buttons } from '../../styles';

const redirectUri = 'https://connect.deezer.com/oauth/auth.php?app_id=389504&redirect_uri=http://10.3.1.1:3000/api/users/deezerlogin&perms=basic_access,email';

export default class DeezerLogin extends Component {
    callDeez = () => {
      Linking.openURL(redirectUri)
        .catch(err => console.error("Couldn't load page", err));
    };

    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={this.callDeez}
            style={Buttons.largeButton}
          >
            <Text style={Buttons.text}>
              Connexion Deezer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

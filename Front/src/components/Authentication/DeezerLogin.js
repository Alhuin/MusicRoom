import {
  View, StyleSheet, Button, Linking,
} from 'react-native';
import React, { Component } from 'react';


export default class DeezerLogin extends Component {
    callDeez = async () => {
      Linking.openURL('https://connect.deezer.com/oauth/auth.php?app_id=389504&redirect_uri=http://10.3.1.1:3000/api/users/deezerlogin&perms=basic_access,email')
        .catch(err => console.error("Couldn't load page", err));
    }

    render() {
      return (
        <View style={styles.container}>
          <Button
            onPress={this.callDeez}
            title="Deezer"
          />
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

import React from 'react';
import {
  View, SafeAreaView, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { DrawerItems } from 'react-navigation';
import { Buttons, Typography, Colors } from '../../styles';

export default class LogoutButton extends React.Component {
  _logout = () => {
    const { setSocket, socket, navigation } = this.props;

    socket.disconnect();
    setSocket(null);
    navigation.navigate('auth');
  };

  render() {
    const { drawerProps } = this.props;

    return (
      <View style={styles.drawer}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...drawerProps} />
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={() => {
                this._logout();
              }}
              style={Buttons.largeButton}
            >
              <Text style={Buttons.text}>
                Déconnexion
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: Colors.background,
    height: '100%',
  },
  buttonWrapper: {
    alignItems: 'center',
  },
});
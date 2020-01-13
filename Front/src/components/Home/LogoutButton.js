import React from 'react';
import {
  View, SafeAreaView, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { DrawerItems } from 'react-navigation';
import { Buttons, Colors } from '../../styles';

export default class LogoutButton extends React.Component {
  _logout = () => {
    const {
      setSocket,
      socket,
      navigation,
      logOut,
    } = this.props;

    socket.disconnect();
    setSocket(null);
    logOut();
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
              activeOpacity={0.7}
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
    borderRightColor: Colors.lightGreen,
    borderRightWidth: 3,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
});

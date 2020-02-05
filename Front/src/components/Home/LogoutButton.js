import React from 'react';
import {
  View, SafeAreaView, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { DrawerItems } from 'react-navigation';
import MusicControl from 'react-native-music-control';
import { setNowPlaying } from '../../../API/BackApi';
import { Buttons, Colors } from '../../styles';

export default class LogoutButton extends React.Component {
  _logout = () => {
    const {
      setSocket,
      socket,
      navigation,
      logOut,
      playlistId,
    } = this.props;

    setNowPlaying(playlistId, null)
      .then(() => {
        socket.disconnect();
        setSocket(null);
        navigation.navigate('auth');
        logOut();
        MusicControl.resetNowPlaying();
      })
      .catch((error) => {
        console.log(error);
      });
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

import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Dimensions, Alert,
} from 'react-native';
import MusicControl from 'react-native-music-control';
import { Icon } from 'native-base';
import { BottomTabBar } from 'react-navigation';
import { Typography, Colors } from '../../styles';
import { setNowPlaying } from '../../../API/BackApi';

export default class CustomTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    props.socket.on('delog', () => {
      Alert.alert('Votre compte est utilisé sur un autre appareil.');
      this._logoutMulti();
    });
  }

  _logoutMulti = () => {
    const {
      setSocket,
      navigation,
      logOut,
      playlistId,
      socket,
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
    const { tabProps } = this.props;

    return (
      <View style={styles.tab}>
        <View
          style={{
            flex: 4,
          }}
        >
          <BottomTabBar
            {...tabProps}
            style={{
              backgroundColor: Colors.background,
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this._logout();
          }}
          style={[Typography.iconWrapper, { width: Dimensions.get('window').width / 5 }]}
        >
          <Icon style={Typography.icon} name="md-log-out" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderTopColor: Colors.lightGreen,
    borderTopWidth: 1,
    width: '100%',
  },
});

import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Icon } from 'native-base';
import { BottomTabBar } from 'react-navigation';
import { Typography, Colors } from '../../styles';

export default class CustomTabNavigator extends React.Component {
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

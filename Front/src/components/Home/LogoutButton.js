import React from 'react';
import { View, SafeAreaView, Button } from 'react-native';
import { DrawerItems } from 'react-navigation';

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
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...drawerProps} />
          <Button
            title="Logout"
            onPress={() => this._logout()}
          />
        </SafeAreaView>
      </View>
    );
  }
}
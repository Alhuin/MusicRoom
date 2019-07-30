import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import Components from '../components';

class UserSettings extends React.Component {
  render() {
    return (
      <View style={styles.content}>
        <Components.Logo />
        <Text>Settings</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
});

export default UserSettings;

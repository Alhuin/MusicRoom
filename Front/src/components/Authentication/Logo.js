import { Image, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import React, { Component } from 'react';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.mainIcon}
          source={require('../../assets/images/deezer-png-300.png')}
        />
        <Text style={styles.title}>MusicRoom</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  mainIcon: {
    width: 100,
    height: 100,
  },
});

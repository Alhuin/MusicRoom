import { Image, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import React, { Component } from 'react';
import { Typography } from '../../styles';

export default class Logo extends Component {
  render() {
    return (
      <View style={[Typography.screenHeader, { flexDirection: 'column' }]}>
        <Text style={Typography.screenHeaderText}>MusicRoom</Text>
        <Image
          style={styles.mainIcon}
          source={require('../../assets/images/deezer-png-300.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainIcon: {
    width: 100,
    height: 100,
  },
});

import {
  Button, StyleSheet, Text, View,
} from 'react-native';
import React, { Component } from 'react';

export default class Playlist extends Component {
  render() {
    const { name } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    //  borderWidth: 1,                LAISSEZ LES
    //  borderColor: 'green',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

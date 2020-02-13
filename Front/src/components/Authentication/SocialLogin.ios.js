import {
  View, StyleSheet,
} from 'react-native';
import React, { Component } from 'react';


export default class SocialLogin extends Component {
  render() {
    return (
      <View style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

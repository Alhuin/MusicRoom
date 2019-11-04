import { View, StyleSheet, Alert } from 'react-native';
import SocialButton from 'rtg-rn-social-buttons';
import React, { Component } from 'react';

export default class SocialLogin extends Component {
  render() {
    const { type } = this.props;
    return (
      <View style={styles.container}>
        <SocialButton
          type="facebook"
          text={`${type} With Facebook`}
          opacity={0.5}
          height={40}
          width={220}
          action={() => Alert.alert(`facebook ${type}`)}
        />
        <SocialButton
          type="google"
          text={`${type} With Google`}
          opacity={0.5}
          height={40}
          width={220}
          action={() => Alert.alert(`google ${type}`)}
        />
      </View>
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

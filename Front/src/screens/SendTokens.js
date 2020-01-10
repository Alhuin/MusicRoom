import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';

class SendTokens extends React.Component {
  render() {
    const { type } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Components.Logo />
        <Components.SendToken type={type} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    //  borderWidth: 1,             LAISSEZ LES
    //  borderColor: 'blue',
  },
});

export default SendTokens;

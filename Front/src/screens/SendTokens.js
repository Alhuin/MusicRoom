import React from 'react';
import {
  SafeAreaView,
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { Colors } from '../styles';

class SendTokens extends React.Component {
  render() {
    const { type } = this.props.navigation.state.params;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.screenHeader }}>
        <View style={styles.main_container}>
          <Components.Logo />
          <Components.SendToken type={type} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default SendTokens;

import React from 'react';
import {
  SafeAreaView,
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { Colors } from '../styles';

class UpdatePass extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.screenHeader }}>
        <View style={styles.main_container}>
          <Components.Logo />
          <Components.UpdatePassForm userId={navigation.getParam('userId')} navigation={navigation} />
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

export default UpdatePass;

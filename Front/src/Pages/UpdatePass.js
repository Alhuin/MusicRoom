import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../Components';

class UpdatePass extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Components.Logo />
        <Components.UpdatePassForm userId={navigation.getParam('data')} />
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
  scrollView: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContext: {
    alignItems: 'flex-end',
  },
});

export default UpdatePass;

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet, View,
} from 'react-native';


export default class Loader extends React.Component {
  render() {
    const { loading } = this.props;

    return (
      loading && (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" style={styles.loading} color="white" />
        </View>
      ));
  }
}

const styles = StyleSheet.create({
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'grey',
  },
  loading: {
    opacity: 1,
  },
  container: {
    backgroundColor: 'black',
  },
});

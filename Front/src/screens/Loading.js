import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { isSignedIn } from '../services/auth';

export default class Loading extends React.Component {
  constructor() {
    super();
    global.userId = '';
  }

  componentDidMount() {
    const { navigation } = this.props;
    // alert("WAOUH")
    // const timer = setTimeout(() => {
    //   alert('An error occured');
    // }, 5000); // catcher infinite loading
    // clearTimeout(timer);
    isSignedIn()
      .then((user) => {
        if (user) {
          global.user = user;
          navigation.navigate('app');
        } else {
          navigation.navigate('auth');
        }
        // alert(global.user._id);
      })
      .catch(() => {
        // if (error.status === 404) {
        navigation.navigate('auth');
        // }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
  },
  mainIcon: {
    height: '100%',
    borderWidth: 1,
    borderColor: 'yellow',
  },
});

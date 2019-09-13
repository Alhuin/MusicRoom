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
    isSignedIn()
      .then((user) => {
        // console.log(user);
        global.user = user;
        navigation.navigate('app');
        // alert(global.user._id);
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 404) {
          navigation.navigate('auth');
        }
        console.log(error + ' [Loading]');
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

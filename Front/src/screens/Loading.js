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
    isSignedIn()
      .then((user) => {
        if (user) {
          global.user = JSON.parse(user);
          navigation.navigate('app');
        } else {
          navigation.navigate('auth');
        }
      })
      .catch(() => alert('An error occurred'));
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

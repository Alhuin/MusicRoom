import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default class Loading extends React.Component {
  componentDidMount() {
    const { navigation, loggedUser } = this.props;
    // const timer = setTimeout(() => {
    //   alert('An error occured');
    // }, 5000); // catcher infinite loading
    // clearTimeout(timer);
    console.log(loggedUser);
    if (loggedUser !== null) {
      navigation.navigate('app');
    } else {
      navigation.navigate('auth');
    }
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

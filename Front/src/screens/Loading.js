import React from 'react';
import { View, Text } from 'react-native';
import { isSignedIn } from '../auth';

export default class Loading extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    isSignedIn()
      .then((res) => {
        if (res) {
          navigation.navigate('app');
        } else {
          navigation.navigate('auth');
        }
      })
      .catch(() => alert('An error occurred'));
  }

  render() {
    return (
      <View><Text>Loader</Text></View>
    );
  }
}

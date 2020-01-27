import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import React, { Component } from 'react';
import NavigationUtils from '../../navigation/NavigationUtils';
import { Typography } from '../../styles';

export default class LoginContext extends Component {
  render() {
    let contextText;
    let other;
    let route;
    const { type } = this.props;

    if (type === 'Sign Up') {
      contextText = <Text style={Typography.bodyText}>Vous possédez déjà un compte ? </Text>;
      other = 'Sign In !';
      route = 'Connexion_noTransition';
    } else {
      contextText = (
        <Text style={Typography.bodyText}>Vous n&apos;avez pas encore de compte ? </Text>
      );
      other = 'Sign Up !';
      route = 'Inscription_noTransition';
    }

    // TODO resetStack nécessaire ?
    return (
      <View style={styles.container}>
        {contextText}
        <TouchableOpacity onPress={() => NavigationUtils.resetStack(this, route, null)}>
          <Text style={[styles.contextLink, Typography.bodyText]}>{other}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  contextLink: {
    fontWeight: 'bold',
  },
});

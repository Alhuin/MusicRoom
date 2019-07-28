import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, View,
} from 'react-native';
import Components from '../Components';

class Connexion extends React.Component {
  render() {
    const { navigation } = this.props;
    const type = 'Sign In';
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={100}
      >
        <View style={styles.content}>
          <Components.Logo />
          <Components.SignInForm navigation={navigation} />
          <Components.SocialLogin type={type} />
          <Components.LoginContext
            type={type}
            navigation={navigation}
            style={styles.loginContext}
          />
        </View>
      </KeyboardAvoidingView>
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

export default Connexion;

import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, View, ScrollView,
} from 'react-native';
import Logo from '../components/Authentication/Logo';
import LoginContext from '../components/Authentication/LoginContext';
import SignInForm from '../containers/SignInForm';
import SocialLogin from '../containers/SocialLogin';

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
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Logo />
            <SignInForm navigation={navigation} />
            <SocialLogin
              type={type}
              navigation={navigation}
            />
            <LoginContext
              type={type}
              navigation={navigation}
              style={styles.loginContext}
            />
          </View>
        </ScrollView>
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

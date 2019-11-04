import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View,
} from 'react-native';
import Components from '../components';

class Inscription extends React.Component {
  render() {
    const type = 'Sign Up';
    const { navigation, userChanged, admin } = this.props;
    userChanged(null);
    admin(false);
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
        >
          <View style={styles.content}>
            <Components.Logo />
            <Components.SignUpForm />
            <Components.SocialLogin type={type} />
            <Components.LoginContext
              navigation={navigation}
              type={type}
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

export default Inscription;

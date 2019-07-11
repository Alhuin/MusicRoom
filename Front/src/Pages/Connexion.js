import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View,
} from 'react-native';
import Components from '../Components';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Sign Up',
    };
  }

  changePage = () => {
    const { type } = this.state;
    if (type === 'Sign Up') {
      this.setState({ type: 'Sign In' });
    } else {
      this.setState({ type: 'Sign Up' });
    }
  };

  render() {
    const { type } = this.state;

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
            <Components.CustomForm type={type} />
            <Components.SocialLogin type={type} />
            <Components.LoginContext
              type={type}
              changePage={this.changePage}
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

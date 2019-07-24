import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View, Linking,
} from 'react-native';
import Components from '../Components';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Sign Up',
    };
  }


  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const { navigation } = this.props;
        if (Platform.OS === 'android') {
          const page = this.parseUrl(url, false);
          const token = this.parseUrl(url, true);
          console.log(`token = ${token}`);
          console.log(`page = ${page}`);
          if (page !== null) {
            if (token !== null) {
              navigation.navigate(page, { token });
            }
            navigation.navigate(page);
          }
        } else if (Platform.OS === 'ios') {
          Linking.addEventListener('url', this.handleOpenURL);
        }
      }
    });
  }

  parseUrl = (url, token) => {
    console.log(url);
    const route = url.replace(/.*?:\/\//g, '');
    const routes = route.match(/\/([^/]+)\/?$/);
    if (token) {
      return routes[2];
    }
    return routes[1];
  };

  handleOpenURL = (event) => {
    const { navigation } = this.props;
    const page = this.parseUrl(event.url, false);
    const token = this.parseUrl(event.url, true);
    if (page !== null) {
      if (token !== null) {
        navigation.navigate(page, { token });
      } else {
        navigation.navigate(page);
      }
    }
  };

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
    const { navigation } = this.props;
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
            <Components.CustomForm type={type} navigation={navigation} />
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

import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View, Linking,
} from 'react-native';
import Components from '../Components';

class Connexion extends React.Component {
  static navigationOptions = { // A
    title: 'Home',
  };

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


  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial url is: " + url);
        const route = url.replace(/.*?:\/\//g, '');
        const routeName = route.split('/')[0];
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        //alert(id);
        const { navigation } = this.props;
        navigation.navigate(id);
      }
    }).catch(err => console.error('An error occurred', err));
  }

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

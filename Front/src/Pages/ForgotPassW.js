import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View,
} from 'react-native';
import Components from '../Components';

class ForgotPassW extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Forgot Pass',
    };
  }

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
            <Components.SendToken type={type} />
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
});

export default ForgotPassW;

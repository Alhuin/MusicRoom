import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import React, { Component } from 'react';


export default class LoginContext extends Component {
  render() {
    let contextText;
    let other;
    const { type, changePage } = this.props;
    if (type === 'Sign Up') {
      contextText = <Text style={styles.contextText}>Already have an account ? </Text>;
      other = 'Sign In !';
    } else {
      contextText = <Text style={styles.contextText}>Don&apos;t have an account yet ? </Text>;
      other = 'Sign Up !';
    }

    return (
      <View style={styles.container}>
        {contextText}
        <TouchableOpacity onPress={changePage}>
          <Text style={styles.contextLink}>{other}</Text>
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
  contextText: {},
  contextLink: {
    fontWeight: 'bold',
  },
});

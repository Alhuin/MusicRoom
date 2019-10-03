import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, Text, View, StyleSheet } from 'react-native';

export default class TextScroller extends Component {
  constructor(props) {
    super(props);
    this.moveAnimation = new Animated.Value({ x: 10 });
  }

  _move = () => {
    Animated.spring(this.moveAnimation, {
      toValue: { x: 250 },
    }).start();
  };

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.tennisBall, this.moveAnimation.getLayout()]}>
          TEXT
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  tennisBall: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'greenyellow',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  button: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
  }
});

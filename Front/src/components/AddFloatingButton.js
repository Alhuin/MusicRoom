import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';


export default class AddFloatingButton extends React.Component {
  render() {
    const { handlePress } = this.props;
    return (
      <TouchableOpacity onPress={handlePress} style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    transform: [{ translateY: -2 }],
    fontSize: 40,
    color: 'white',
  },
});

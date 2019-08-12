import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

export default class AddFloatingButton extends React.Component {
  render() {
    const { handlePress } = this.props;
    return (
      <TouchableOpacity style={styles.main_container} onPress={handlePress}>
        <Icon
          style={styles.icon}
          name="add"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    borderRadius: 30,
    height: 50,
    width: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  icon: {
    color: 'blue',
  },
});

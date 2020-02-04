import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { Buttons } from '../styles';

export default class AddFloatingButton extends React.Component {
  render() {
    const { icon, handlePress } = this.props;
    let image = '';
    if (icon === 'addPlaylist') {
      image = (
        <Image
          source={require('../assets/images/addPlaylist.png')}
          style={{ height: 32, width: 32, transform: [{ translateX: +3 }, { translateY: +2 }] }}
        />
      );
    } else if (icon === 'addMusic') {
      image = (
        <Image
          source={require('../assets/images/addMusic.png')}
          style={{ height: 38, width: 38, transform: [{ translateY: +1 }, { translateX: +1 }] }}
        />
      );
    } else if (icon === 'joinPrivateRoom') {
      image = (
        <Image
          source={require('../assets/images/glasse.png')}
          style={{ height: 38, width: 38, transform: [{ translateY: +1 }, { translateX: +1 }] }}
        />
      );
    } else {
      image = <Text style={styles.fabIcon}>+</Text>;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[styles.fab, { bottom: icon === 'addMusic' ? 150 : 70 }]}
      >
        {image}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    ...Buttons.fab,
    position: 'absolute',
    right: 20,
  },
  fabIcon: {
    ...Buttons.fabIcon,
  },
});

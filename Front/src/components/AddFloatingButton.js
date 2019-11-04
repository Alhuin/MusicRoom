import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from 'react-native';


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
      <TouchableOpacity onPress={handlePress} style={[styles.fab, { bottom: icon === 'addMusic' ? 150 : 70 }]}>
        {image}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    // bottom: this.props.icon === 'addMusic' ? 150 : 70,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    // elevation: 8,
  },
  fabIcon: {
    transform: [{ translateX: +2 }],
    height: 30,
    width: 30,
    color: 'white',
  },
});

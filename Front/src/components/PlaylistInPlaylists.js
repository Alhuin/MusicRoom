import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class PlaylistInPlaylists extends React.Component {// WTF LE NOM ?
  _pressPlaylist = () => {
    const { navigation, playlistId } = this.props;
    navigation.push('Playlist', { playlistId });
  };

  render() {
    const { name } = this.props;
    return (
      <TouchableOpacity style={styles.list} onPress={this._pressPlaylist} activeOpacity={1}>
        <Text>{ name }</Text>
        <View style={styles.Author}>
          <Text>Author : </Text>
          <Icon name="people" />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    margin: 5,
    backgroundColor: 'white',
    height: 120,
    justifyContent: 'space-around',
    padding: 10,
    elevation: 1,
  },
  Author: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

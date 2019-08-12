import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

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
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    margin: 5,
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'space-around',
    paddingLeft: 10,
    elevation: 1,
  },
});

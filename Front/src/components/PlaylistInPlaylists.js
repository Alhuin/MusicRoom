import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import { getUserById } from '../../API/BackApi';

// must create two components PlaylistInParty and PlaylistInRadio or this one need to be modified

export default class PlaylistInPlaylists extends React.Component {

  componentDidMount(): void {
  }

  _pressPlaylist = () => {
    const {
      navigation,
      playlistId,
      roomType,
      name,
    } = this.props;
    navigation.push('Playlist', { playlistId, roomType, name });
  };

  render() {
    const { name, roomType, authorName } = this.props;

    if (roomType === 'radio') {
      return (
        <TouchableOpacity style={styles.list} onPress={this._pressPlaylist} activeOpacity={1}>
          <Text>{ name }</Text>
          <View style={styles.Author}>
            <Text>
              Author : { authorName }
            </Text>
            <Icon name="people" />
          </View>
        </TouchableOpacity>
      );
    } else if (roomType === 'party') {
      return (
        <TouchableOpacity style={styles.list} onPress={this._pressPlaylist} activeOpacity={1}>
          <Text>{ name }</Text>
          <View style={styles.Author}>
            <Text>
              Author : { authorName }
            </Text>
            <Icon name="people" />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (null);
    }
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

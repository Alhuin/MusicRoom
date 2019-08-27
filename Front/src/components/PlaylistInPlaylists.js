import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import { getUserById } from '../../API/BackApi';

export default class PlaylistInPlaylists extends React.Component {// WTF LE NOM ?
  state = {
    authorName: '',
  };

  componentDidMount(): void {
    const { authorId } = this.props;
    getUserById(authorId)
      .then((response) => {
        this.setState({ authorName: response.name });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _pressPlaylist = () => {
    const { navigation, playlistId } = this.props;
    navigation.push('Playlist', { playlistId });
  };

  render() {
    const { name } = this.props;
    const { authorName } = this.state;
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

import { FlatList } from 'react-native';
import React from 'react';
import PlaylistInPlaylists from './PlaylistInPlaylists';

class PlaylistList extends React.Component {
  render() {
    const { playlists, navigation } = this.props;
    return (
      <FlatList
        data={playlists}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => (
            <PlaylistInPlaylists
              name={item.name}
              playlistId={item._id}
              navigation={navigation}
              userId={item.users}
              // Ici recuperer les users(mais je pleurs l'object users
              // dans playlist n'ai ps accessible pour avoir le nom de l'author)
            />
          )
        }
      />
    );
  }
}

export default PlaylistList;

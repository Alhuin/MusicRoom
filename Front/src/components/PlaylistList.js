import { FlatList, RefreshControl } from 'react-native';
import React from 'react';
import PlaylistInPlaylists from './PlaylistInPlaylists';

class PlaylistList extends React.Component {
  render() {
    const {
      playlists,
      navigation,
      refreshing,
      onRefresh,
      userId,
    } = this.props;
    return (
      <FlatList
        data={playlists}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => (
            <PlaylistInPlaylists
              name={item.name}
              authorId={item.author}
              playlistId={item._id}
              navigation={navigation}
              userId={userId}
              // Ici recuperer les users(mais je pleurs l'object users
              // dans playlist n'ai ps accessible pour avoir le nom de l'author)
            />
          )
        }
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )
        }
      />
    );
  }
}

export default PlaylistList;

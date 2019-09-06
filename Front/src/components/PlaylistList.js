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
      roomType,
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
              authorName={item.authorName}
              playlistId={item._id}
              navigation={navigation}
              userId={userId}
              roomType={roomType}
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
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  }
}

export default PlaylistList;

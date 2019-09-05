import { FlatList, RefreshControl, StyleSheet } from 'react-native';
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
        style={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 50,
  },
});

export default PlaylistList;

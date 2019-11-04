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
    // console.log(playlists);
    return (
      <FlatList
        data={playlists}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            let isUserInPlaylist = false;
            for (let i = 0; i < item.users.length; i += 1) {
              if (String(userId) === String(item.users[i])) {
                isUserInPlaylist = true;
                break;
              }
            }
            return (
              <PlaylistInPlaylists
                name={item.name}
                authorId={item.author}
                authorName={item.authorName}
                playlistId={item._id}
                users={item.users}
                navigation={navigation}
                userId={userId}
                roomType={roomType}
                isUserInPlaylist={isUserInPlaylist}
              />
            );
          }
        }
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  }
}

export default PlaylistList;

import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import TrackInPlaylist from './TrackInPlaylist';
import Player from '../services/Player';

class TracklistInPlaylist extends React.Component {
  handlePress = (preview) => {
    const { playing, updatePlaying } = this.props;
    if (playing !== null) {
      playing.stop(() => {
        const toPlay = Player.play(preview);
        updatePlaying(toPlay);
      });
    } else {
      const toPlay = Player.play(preview);
      updatePlaying(toPlay);
    }
  };

  render() {
    const {
      tracks,
      playlistId,
      updateTracks,
      refreshing,
      onRefresh,
      userId,
      roomType,
    } = this.props;
    return (
      <FlatList
        data={tracks}
        keyExtractor={item => item._id.toString()}
        renderItem={item => (
          <TrackInPlaylist
            userId={userId}
            track={item.item}
            handlePress={this.handlePress}
            playlistId={playlistId}
            updateTracks={updateTracks}
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
        // onEndReachThreashold={0.5}
        // onEndReached={() => {
        //   if (this.page < this.totalPages) {
        //     this._loadTracks();
        //   }
        // }}
        contentContainerStyle={{ paddingBottom: 200 }}
      />
    );
  }
}

export default TracklistInPlaylist;

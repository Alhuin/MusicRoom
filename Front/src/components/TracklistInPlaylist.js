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
      myVotes,
      updateMyVotes,
    } = this.props;
    return (
      <FlatList
        data={tracks}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => {
          let myVoteValue = 0;
          for (let i = 0; i < myVotes.length; i++) {
            if (String(myVotes[i].music) === String(item._id)) {
              myVoteValue = myVotes[i].value;
            }
          }
          return (
            <TrackInPlaylist
              userId={userId}
              track={item}
              handlePress={this.handlePress}
              playlistId={playlistId}
              updateTracks={updateTracks}
              updateMyVotes={updateMyVotes}
              roomType={roomType}
              myVoteValue={myVoteValue}
            />
          );
        }}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
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

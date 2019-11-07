import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { moveTrackOrder } from '../../../API/BackApi';
import TrackInPlaylist from '../../containers/TrackInPlaylist';
import Player from '../../services/Player';

class TrackListInPlaylist extends React.Component {
  handlePress = (preview) => {
    const { playing, updatePlaying } = this.props;
    if (playing !== null) {
      if (playing._filename !== preview) {
        playing.stop(() => {
          const toPlay = Player.play(preview);
          updatePlaying(toPlay);
        });
      } else {
        playing.stop(() => {
          updatePlaying(null);
        });
      }
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
      isUserInPlaylist,
    } = this.props;
    let render = (null);
    // console.log('renderList');
    if (isUserInPlaylist === true && roomType === 'radio') {
      render = (
        <DraggableFlatList
          data={tracks}
          keyExtractor={item => String(item._id)}
          renderItem={({
            item, move, moveEnd, isActive, // Index necessaire ?
          }) => {
            let myVoteValue = 0;
            for (let i = 0; i < myVotes.length; i += 1) {
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
                move={move}
                moveEnd={moveEnd}
                isActive={isActive}
              />
            );
          }}
          // onEndReachThreashold={0.5}
          // onEndReached={() => {
          //   if (this.page < this.totalPages) {
          //     this._loadTracks();
          //   }
          // }}
          contentContainerStyle={{ paddingBottom: 200 }}
          onMoveEnd={(data) => {
            moveTrackOrder(playlistId, data.row._id, data.to)
              .then(() => {
                onRefresh();
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      );
    } else {
      render = (
        <FlatList
          data={tracks}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => {
            let myVoteValue = 0;
            for (let i = 0; i < myVotes.length; i += 1) {
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
    return (render);
  }
}

export default TrackListInPlaylist;

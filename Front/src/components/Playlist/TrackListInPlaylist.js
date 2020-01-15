import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import SortableList from 'react-native-sortable-list';
import TrackInPlaylist from '../../containers/TrackInPlaylist';
import Player from '../../services/Player';
import { Spacing } from '../../styles';

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
      // isUserInPlaylist,
      editor,
      onMoveEnd,
      pos,
      currentTrack,
    } = this.props;
    let render;
    let sortedTracks = tracks;
    if (currentTrack) {
      const currentTrackInPlaylist = tracks.filter(item => item._id === currentTrack.id)[0];
      sortedTracks = tracks.filter(item => item._id !== currentTrack.id);
      sortedTracks.unshift(currentTrackInPlaylist);
      // TODO fix out > in
    }

    if (/*
      isUserInPlaylist === true && */ roomType === 'radio') {
      const sortableListMapping = {};
      for (let i = 0; i < tracks.length; i += 1) {
        sortableListMapping[`${i}`] = tracks[i]._id;
      }
      // console.log(tracks.map(a => a._id));
      // console.log(sortableListMapping);
      render = (
        <SortableList
          data={sortedTracks}
          renderRow={({ key, index, data, disabled, active }) => (
            // TODO check necessary parameters ?
            <TrackInPlaylist
              active={active}
              userId={userId}
              track={data}
              handlePress={this.handlePress}
              playlistId={playlistId}
              updateTracks={updateTracks}
              updateMyVotes={updateMyVotes}
              roomType={roomType}
              myVoteValue={0}
              editor={editor}
              pos={pos}
            />
          )}
          contentContainerStyle={{ paddingBottom: Spacing.paddingMiniPlayer }}
          onReleaseRow={(key, currentOrder) => {
            let newPosition;
            for (newPosition = 0; newPosition < currentOrder.length; newPosition += 1) {
              if (currentOrder[newPosition] === `${key}`) {
                break;
              }
            }
            const id = sortableListMapping[`${key}`];
            onMoveEnd(id, newPosition);
          }}
        />
      );
    } else {
      render = (
        <FlatList
          data={sortedTracks}
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
                editor={editor}
                pos={pos}
              />
            );
          }}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
          contentContainerStyle={{ paddingBottom: Spacing.paddingMiniPlayer }}
        />
      );
    }
    return (render);
  }
}

export default TrackListInPlaylist;

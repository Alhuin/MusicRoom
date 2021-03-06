import React from 'react';
import { FlatList, RefreshControl, Dimensions } from 'react-native';
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
      refreshing,
      onRefresh,
      userId,
      roomType,
      myVotes,
      // isUserInPlaylist,
      editor,
      onMoveEnd,
      pos,
      admin,
      deleteTrackInPlaylist,
      nowPlaying,
    } = this.props;
    let render;
    let sortedTracks = tracks;
    if (roomType === 'party' && tracks[0] && nowPlaying) {
      const currentTrackInPlaylist = tracks.filter(item => item._id === nowPlaying)[0];
      if (currentTrackInPlaylist) {
        sortedTracks = tracks.filter(item => item._id !== nowPlaying);
        sortedTracks.unshift(currentTrackInPlaylist);
      }
    }
    if (roomType === 'radio' && editor) {
      const sortableListMapping = {};
      for (let i = 0; i < tracks.length; i += 1) {
        sortableListMapping[`${i}`] = tracks[i]._id;
      }
      render = (
        <SortableList
          data={tracks}
          renderRow={({ data, active }) => (
            // TODO check necessary parameters ?
            <TrackInPlaylist
              active={active}
              userId={userId}
              track={data}
              handlePress={this.handlePress}
              playlistId={playlistId}
              deleteTrackInPlaylist={deleteTrackInPlaylist}
              roomType={roomType}
              myVoteValue={0}
              editor={editor}
              pos={pos}
              admin={admin}
            />
          )}
          contentContainerStyle={{ paddingBottom: Dimensions.get('window').height / 2 }}
          style={{ maxHeight: (Dimensions.get('window').height / 100) * 80 }}
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
          rowActivationTime={150}
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
                nowPlaying={nowPlaying}
                handlePress={this.handlePress}
                playlistId={playlistId}
                deleteTrackInPlaylist={deleteTrackInPlaylist}
                roomType={roomType}
                myVoteValue={myVoteValue}
                editor={editor}
                pos={pos}
                admin={admin}
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

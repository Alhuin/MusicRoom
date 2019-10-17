import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { moveTrackOrder } from '../../../API/BackApi';
import TrackInPlaylist from './TrackInPlaylist';
import Player from '../../services/Player';

class TracklistInPlaylist extends React.Component {

  state = {
    stateTracks: [],
    firstPassage: true,
  };

  componentDidMount(): void {
    const { tracks } = this.props;
    this.setState({ stateTracks: tracks });
  }

  componentDidUpdate(): void {
    // console.log('updateList');
    const { tracks } = this.props;
    const { stateTracks, firstPassage } = this.state;
    if (JSON.stringify(stateTracks) !== JSON.stringify(tracks) && firstPassage === true) {
      this.setState({ stateTracks: tracks, firstPassage: false });
    }
/*    if (JSON.stringify(stateTracks) !== JSON.stringify(tracks)) {
      this.setState({ stateTracks: tracks });
    }*/
  }

/*  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    const { tracks } = this.props;
    const { stateTracks, firstPassage } = this.state;
    /!*    if (JSON.stringify(stateTracks) !== JSON.stringify(tracks) && firstPassage === true) {
          this.setState({ stateTracks: tracks, firstPassage: false });
        }*!/
    if (JSON.stringify(stateTracks) !== JSON.stringify(tracks)) {
      this.setState({ stateTracks: tracks });
    }
  }*/

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
    const { stateTracks } = this.state;
    let render = (null);
    // console.log('renderList');
    if (isUserInPlaylist === true && roomType === 'radio') {
      render = (
        <DraggableFlatList
          data={stateTracks}
          keyExtractor={item => String(item._id)}
          renderItem={({ item, index, move, moveEnd, isActive }) => {
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
            this.setState({ stateTracks: data.data });
            moveTrackOrder(playlistId, data.row._id, data.to)
              .then((response) => {
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
    return (render);
  }
}

export default TracklistInPlaylist;

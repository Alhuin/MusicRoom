import React from 'react';
import { FlatList } from 'react-native';
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
    const { tracks, playlistId, updateTracks } = this.props;
    return (
      <FlatList
        data={tracks}
        keyExtractor={item => item._id.toString()}
        renderItem={item => (
          <TrackInPlaylist
            track={item.item}
            handlePress={this.handlePress}
            playlistId={playlistId}
            updateTracks={updateTracks}
          />
        )
        }
        // onEndReachThreashold={0.5}
        // onEndReached={() => {
        //   if (this.page < this.totalPages) {
        //     this._loadTracks();
        //   }
        // }}
      />
    );
  }
}

export default TracklistInPlaylist;

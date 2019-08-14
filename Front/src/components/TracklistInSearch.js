import React from 'react';
import {
  FlatList,
} from 'react-native';
import TrackInSearch from './TrackInSearch';
import Player from '../services/Player';

class TrackListInSearch extends React.Component {
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
      tracks, playlistId, updateTracks, userId, setModalVisible,
    } = this.props;
    // console.log(tracks);
    return (
      <FlatList
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={item => (
          <TrackInSearch
            track={item.item}
            handlePress={this.handlePress}
            playlistId={playlistId}
            updateTracks={updateTracks}
            userId={userId}
            setModalVisible={setModalVisible}
          />
        )
        }
        // onEndReachThreashold={0.5}
        // onEndReached={() => {
        //   this._loadTracks();
        // }
        // }
      />
    );
  }
}

export default TrackListInSearch;

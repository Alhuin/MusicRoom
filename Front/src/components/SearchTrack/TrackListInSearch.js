import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import TrackInSearch from './TrackInSearch';
import Player from '../../services/Player';

class TrackListInSearch extends React.Component {
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
      tracks, playlistId, updateTracks, userId, setModalVisible, displayLoader, playing,
    } = this.props;
    return (
      <FlatList
        style={styles.container}
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={item => (
          <TrackInSearch
            playing={playing}
            displayLoader={displayLoader}
            track={item.item}
            handlePress={this.handlePress}
            playlistId={playlistId}
            updateTracks={updateTracks}
            userId={userId}
            setModalVisible={setModalVisible}
          />
        )}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});

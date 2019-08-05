import React from 'react';
import {
  FlatList, StyleSheet,
} from 'react-native';
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
    const { tracks } = this.props;
    return (
      <FlatList
        data={tracks}
        keyExtractor={item => item._id.toString()}
        renderItem={item => (
          <TrackInPlaylist
            track={item.item}
            handlePress={this.handlePress}
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

const styles = StyleSheet.create({
  main_container: {
    height: 120,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
  },
  content_container: {
    flex: 1,
    margin: 5,
  },
  header_container: {
    flex: 3,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 5,
    paddingRight: 5,
  },
  description_container: {
    flex: 7,
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
  },
  date_container: {
    flex: 1,
  },
  date_text: {
    fontSize: 14,
  },

});

export default TracklistInPlaylist;

import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getMusicsByVoteInPlaylist } from '../../API/BackApi';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      searchedText: '',
      playing: null,
    };
  }

  componentDidMount(): void {
    const { navigation } = this.props;
    // console.log(navigation);
    // this._navListener = navigation.addListener('didBlur', this._onChangedPage);
    console.log(`Did Mount : You Opened Playlist ${navigation.getParam('playlistId')}`);
    this.updateTracks();
  }

  componentWillUnmount(): void {
    this._onChangedPage();
    // this._navListener.remove();
  }

  _onChangedPage = () => {
    const { playing } = this.state;
    if (playing !== null) {
      playing.stop();
    }
  };

  updateTracks = () => {
    const { navigation } = this.props;
    // console.log( this.props );
    const playlistId = navigation.getParam('playlistId');
    getMusicsByVoteInPlaylist(playlistId)
      .then((response) => {
        this.setState({ tracks: response });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  updateSearchedText = (text) => {
    this.setState({ searchedText: text });
  };

  updatePlaying = (playing) => {
    this.setState({ playing });
  };

  searchTracks = () => {
    const { tracks, searchedText } = this.state;
    this.setState({ tracks: [] }, () => {
      tracks.filter(track => searchedText.indexOf(track.name) > -1
        || searchedText.indexOf(track.artist) > -1);
    });
  };

  render() {
    const { tracks, playing } = this.state;
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    return (
      <View style={{ height: '100%' }}>
        <View style={styles.container}>
          <Components.SearchBar
            updateSearchedText={this.updateSearchedText}
            searchTracks={this.searchTracks}
          />
          <Components.TracklistInPlaylist
            tracks={tracks}
            updatePlaying={this.updatePlaying}
            playing={playing}
            playlistId={playlistId}
            updateTracks={this.updateTracks}
          />
        </View>
        <Components.AddFloatingButton handlePress={() => alert('addPlaylist')} icon="addMusic" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    // color: 'white',
  },
  playlistContainer: {
    // backgroundColor: '#999966',
    width: '100%',
  },
  playlist: {
    margin: 0,
  },
});

export default Playlist;

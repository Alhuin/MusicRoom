import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getMusicsByPlaylist } from '../../API/BackApi';

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
    const playlistId = navigation.getParam('playlistId');
    this._navListener = navigation.addListener('didBlur', this._onChangedPage);
    getMusicsByPlaylist(playlistId)
      .then((response) => {
        this.setState({ tracks: response });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount(): void {
    this._navListener.remove();
  }

  _onChangedPage = () => {
    const { playing } = this.state;
    if (playing !== null) {
      playing.stop();
    }
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
    return (
      <View style={styles.container}>
        <Components.SearchBar
          updateSearchedText={this.updateSearchedText}
          searchTracks={this.searchTracks}
        />
        <Components.TracklistInPlaylist
          tracks={tracks}
          updatePlaying={this.updatePlaying}
          playing={playing}
        />
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

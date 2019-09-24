import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import SearchBar from './SearchBar';
import Loader from './Loader';
import TracklistInSearch from './TracklistInSearch';
import { getTracks } from '../../API/DeezerApi';

export default class SearchTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      searchText: '',
      playing: null,
      loading: false,
    };
  }

  componentWillUnmount(): void {
    this._stopPlaying();
  }

  displayLoader = () => {
    this.setState({ loading: true });
  };

  _stopPlaying = () => {
    const { playing } = this.state;
    if (playing !== null) {
      playing.stop();
    }
  };

  updatePlaying = (playing) => {
    this.setState({ playing });
  };

  updateSearchedText = (text) => {
    this.setState({ searchedText: text });
  };

  searchTracks = () => {
    const { searchedText } = this.state;
    // if (text.length > 0) {
    this.setState({ loading: true });
    getTracks(searchedText).then((data) => {
      this.setState({
        tracks: data,
        loading: false,
      });
    });
    // }
  };

  render() {
    const { tracks, playing, loading } = this.state;
    const {
      playlistId,
      userId,
      updateTracks,
      setModalVisible,
    } = this.props;

    return (
      <View style={styles.container}>
        <SearchBar
          updateSearchedText={this.updateSearchedText}
          searchTracks={this.searchTracks}
          autoSearch={false}
        />
        <TracklistInSearch
          tracks={tracks}
          displayLoader={this.displayLoader}
          updatePlaying={this.updatePlaying}
          playing={playing}
          playlistId={playlistId}
          userId={userId}
          updateTracks={updateTracks}
          setModalVisible={setModalVisible}
        />
        <Loader loading={loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    opacity: 1,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
  },
});

import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import SearchBar from './SearchBar';
import TracklistInSearch from './TracklistInSearch';
import { getTracks } from '../../API/DeezerApi';

export default class SearchTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      searchedText: '',
      playing: null,
    };
  }

  componentWillUnmount(): void {
    this._onChangedPage();
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
    this.setState({ tracks: [] }, () => {
      this._loadTracks();
    });
  };

  _loadTracks() {
    const { tracks, searchedText } = this.state;
    if (searchedText.length > 0) {
      // this.setState({loading: true});
      getTracks(searchedText).then((data) => {
        this.setState({
          tracks: [...tracks, ...data],
          // loading: false
        });
      });
    }
  }

  render() {
    const { tracks, playing } = this.state;
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
        />
        <TracklistInSearch
          tracks={tracks}
          updatePlaying={this.updatePlaying}
          playing={playing}
          playlistId={playlistId}
          userId={userId}
          updateTracks={updateTracks}
          setModalVisible={setModalVisible}
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
});

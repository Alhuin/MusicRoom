import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getTracks } from '../../API/DeezerApi';

export default class SearchTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      searchedText: '',
    };
  }

  updateSearchedText = (text) => {
    this.setState({ searchedText: text });
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
        // console.log(data);
        this.setState({
          tracks: [...tracks, ...data],
          // loading: false
        });
      });
    }
  }

  render() {
    const { tracks } = this.state;
    return (
      <View style={styles.container}>
        <Components.SearchBar
          updateSearchedText={this.updateSearchedText}
          searchTracks={this.searchTracks}
        />
        <Components.TracklistInSearch tracks={tracks} />
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
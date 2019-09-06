import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import Components from '../components';
import { getMusicsByVoteInPlaylist, isAdmin } from '../../API/BackApi';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      tracks: [],
      searchedText: '',
      playing: null,
      refreshing: false,
      modalVisible: false,
    };
  }

  componentDidMount(): void {
    this._isAdmin();
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.updateTracks().then(() => {
      this.setState({ refreshing: false });
    });
  };

  setModalVisible = () => {
    const { modalVisible } = this.state;
    const visible = !modalVisible;
    this.setState({ modalVisible: visible });
  };

  updateTracks = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
    // console.log( this.props );
    const playlistId = navigation.getParam('playlistId');
    getMusicsByVoteInPlaylist(playlistId)
      .then((response) => {
        this.setState({ tracks: response });
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

  _isAdmin = () => {
    const { navigation } = this.props;
    const userId = global.user._id;
    const playlistId = navigation.getParam('playlistId');
    isAdmin(userId, playlistId)
      .then((response) => {
        if (response === true) {
          this.setState({ admin: true });
        }
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
    const {
      tracks, playing, refreshing, modalVisible, admin,
    } = this.state;
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');
    const name = navigation.getParam('name');
    const userId = global.user._id;
    let settingsIcon = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PlaylistSettings', { playlistId, isAdmin: admin });
        }}
      >
        <Icon name="musical-notes" />
      </TouchableOpacity>
    );
    if (admin === true) {
      settingsIcon = (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PlaylistSettings', { playlistId, isAdmin: admin });
          }}
        >
          <Icon name="settings" />
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ height: '100%' }}>
        <View
          style={styles.titleContainer}
        >
          {settingsIcon}
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <Components.AddMusicModal
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          playlistId={playlistId}
          updateTracks={this.updateTracks}
          userId={userId}
        />
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
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            userId={userId}
            roomType={roomType}
          />
        </View>
        <Components.AddFloatingButton handlePress={() => this.setModalVisible(true)} icon="addMusic" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
    height: '100%',
  },
  titleContainer: {
    width: '90%',
    flexDirection: 'row',
    padding: 10,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
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

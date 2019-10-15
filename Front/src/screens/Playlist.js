import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Icon } from 'native-base';
import Components from '../components';
import {
  getMusicsByVoteInPlaylist, isAdmin, getMyVotesInPlaylist, getNextTrackByVote,
} from '../../API/BackApi';
import Player from '../components/Player/Player';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      stockedTracks: [],
      tracks: [],
      playing: null,
      refreshing: false,
      modalVisible: false,
      myVotes: [],
    };
  }

  componentDidMount(): void {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    // console.log(playlistId);
    this._isAdmin();
    this.updateMyVotes().then(() => {
      this.updateTracks();
    });
    getNextTrackByVote(playlistId)
      .then((track) => {
        console.log('nextTrack');
        console.log(track);
        this.setState(track);
      })
      .catch(error => console.log(error));
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
    this.updateMyVotes().then(() => {
      this.updateTracks().then(() => {
        this.setState({ refreshing: false });
      });
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
        this.setState({ tracks: response, stockedTracks: response });
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

  updateMyVotes = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const userId = global.user._id;
    getMyVotesInPlaylist(userId, playlistId)
      .then((votes) => {
        this.setState({ myVotes: votes });
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

  updatePlaying = (playing) => {
    this.setState({ playing });
  };

  searchTracks = (text) => {
    let { tracks } = this.state;
    const { stockedTracks } = this.state;
    if (text !== '') {
      tracks = stockedTracks.filter(track => track.title.search(new RegExp(text, 'i')) > -1
        || track.artist.search(new RegExp(text, 'i')) > -1);
    } else {
      tracks = stockedTracks;
    }
    this.setState({ tracks });
  };

  render() {
    const {
      tracks, playing, refreshing, modalVisible, admin, myVotes, track,
    } = this.state;
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');
    const name = navigation.getParam('name');
    const authorId = navigation.getParam('authorId');
    const userId = global.user._id;
    // const nowPlaying = this._getNowPlaying();
    // console.log(track);
    const nowPlayingCover = (
      <Image source={{ uri: 'https://api.deezer.com/album/302127/image' }} style={{ height: 50, width: 50 }} />
    );
    const nowPlayingDetails = {
      title: 'Harder Better Faster Stronger',
      artist: 'Daft Punk',
      album: 'Discovery',
    };
    /*
          Double fonction ? '-'
     */
    let settingsIcon = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PlaylistSettings', {
            playlistId, isAdmin: admin, authorId, roomType,
          });
        }}
      >
        <Icon name="musical-notes" />
      </TouchableOpacity>
    );
    const playIcon = (
      <TouchableOpacity
        onPress={() => {
          getNextTrackByVote(playlistId)
            .then((nextTrack) => {
              this.setState({ track: nextTrack });
              if (nextTrack !== null) {
                navigation.navigate('Player', { playlistId, track: nextTrack, onGoBack: this.onGoBack });
              }
            })
            .catch(error => console.log(error));
        }}
        style={styles.headerIconWrapper}
      >
        <Icon name="play" />
      </TouchableOpacity>
    );
    if (admin === true) {
      settingsIcon = (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PlaylistSettings', {
              playlistId, isAdmin: admin, authorId, roomType,
            });
          }}
          style={styles.headerIconWrapper}
        >
          <Icon name="settings" />
        </TouchableOpacity>
      );
    }
    // console.log(this.state.myVotes);

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          {playIcon}
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
          roomType={roomType}
        />
        <View style={styles.container}>
          <Components.SearchBar
            updateSearchedText={null}
            searchTracks={this.searchTracks}
            autoSearch
          />
          <Components.TracklistInPlaylist
            tracks={tracks}
            updatePlaying={this.updatePlaying}
            playing={playing}
            playlistId={playlistId}
            updateTracks={this.updateTracks}
            updateMyVotes={this.updateMyVotes}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            userId={userId}
            roomType={roomType}
            myVotes={myVotes}
          />
        </View>
        <Components.AddFloatingButton
          handlePress={() => this.setModalVisible(true)}
          icon="addMusic"
        />
        {/*{ nowPlayingCover*/}
        {/*  && (*/}
        {/*  <Components.MiniPlayer*/}
        {/*    handlePress={() => this.refs.player.open()}*/}
        {/*    isAdmin={admin}*/}
        {/*    cover={nowPlayingCover}*/}
        {/*    details={nowPlayingDetails}*/}
        {/*  />*/}
        {/*  )*/}
        {/*}*/}
        {/*<Modal*/}
        {/*  style={styles.playerModal}*/}
        {/*  ref="player"*/}
        {/*  // swipeToClose*/}
        {/*  // backButtonClose*/}
        {/*  coverScreen={false}*/}
        {/*>*/}
        {/*  <Player track={track} playlistId={playlistId} />*/}
        {/*</Modal>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
    flex: 1,
  },
  headerIconWrapper: {
    marginLeft: 10,
  },
  headerContainer: {
    width: '90%',
    flexDirection: 'row',
    paddingRight: 10,
  },
  title: {
    fontSize: 22,
    marginLeft: 10,
    // color: 'white',
  },
  playlistContainer: {
    // backgroundColor: '#999966',
    // width: '100%',
  },
  playerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Playlist;

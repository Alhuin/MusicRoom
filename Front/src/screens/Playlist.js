import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { Icon } from 'native-base';
import Components from '../components';
import {
  getMusicsByVote, isAdmin, getMyVotesInPlaylist, getNextTrackByVote,
  isEditor, moveTrackOrder, deleteTrackFromPlaylist, getEditRestriction,
} from '../../API/BackApi';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false,
      editor: false,
      stockedTracks: [],
      tracks: [],
      playing: null,
      refreshing: false,
      modalVisible: false,
      myVotes: [],
      playlistLaunched: false,
      pos: {},
    };
    this.onRefreshSignal = this._onRefreshSignal.bind(this);
    props.socket.on('refresh', this.onRefreshSignal);
  }

  componentDidMount(): void {
    const { navigation, socket } = this.props;
    const playlistId = navigation.getParam('playlistId');
    this._isMounted = true;

    socket.emit('userJoinedPlaylist', playlistId);
    this.isAdminAndisEditor();
    this.updateMyVotes()
      .then(() => this.updateTracks())
      .catch(error => console.log(error));
    getNextTrackByVote(playlistId)
      .then((track) => {
        this.setState(track);
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount(): void {
    const { navigation, socket } = this.props;
    const playlistId = navigation.getParam('playlistId');
    this._isMounted = false;

    socket.emit('userLeavedPlaylist', playlistId);
    this._onChangedPage();
  }

  _onChangedPage = () => {
    const { playing } = this.state;
    if (playing !== null) {
      playing.stop();
    }
  };

  _onRefreshSignal = () => {
    if (this._isMounted) {
      console.log('[Socket Server] : refresh signal recieved');
      this.isAdminAndisEditor();
      this.updateMyVotes()
        .then(() => {
          this.updateTracks();
        });
    }
  };

  _onRefresh = () => {
    const { navigation } = this.props;
    const roomType = navigation.getParam('roomType');
    this.isAdminAndisEditor();
    if (roomType === 'party') {
      this.setState({ refreshing: true });
      this.updateMyVotes()
        .then(() => {
          this.updateTracks()
            .then(() => {
              this.setState({ refreshing: false });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (roomType === 'radio') {
      this.updateTracks()
        .then(() => {
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
    const roomType = navigation.getParam('roomType');
    getMusicsByVote(playlistId, roomType)
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
    const { navigation, loggedUser } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const userId = loggedUser._id;
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

  isAdminAndisEditor = () => {
    const { navigation, loggedUser } = this.props;
    const userId = loggedUser._id;
    const playlistId = navigation.getParam('playlistId');
    isAdmin(userId, playlistId)
      .then((response) => {
        if (response === true) {
          this.setState({ admin: true });
        }
        this._isEditor();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _isEditor = () => {
    const { navigation, loggedUser } = this.props;
    const userId = loggedUser._id;
    const playlistId = navigation.getParam('playlistId');
    getEditRestriction(playlistId)
      .then((data) => {
        if (data === 'EVENT_RESTRICTED') {
          // eslint-disable-next-line no-undef
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({ pos: position });
              isEditor(playlistId, userId, position)
                .then((response) => {
                  if (response === true) {
                    this.setState({ editor: true });
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            },
            error => Alert.alert(
              `${error.message}\n Position introuvable.`,
            ),
            { enableHighAccuracy: false, timeout: 10000 },
          );
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
      tracks, playing, refreshing, modalVisible, admin, myVotes, editor, playlistLaunched, pos,
    } = this.state;
    const {
      navigation, changeTrack, changePlaylist, loggedUser, socket,
    } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');
    const name = navigation.getParam('name');
    const authorId = navigation.getParam('authorId');
    const isUserInPlaylist = navigation.getParam('isUserInPlaylist');
    const userId = loggedUser._id;
    let settingsIcon = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PlaylistSettings', {
            playlistId, isAdmin: admin, authorId, roomType,
          });
        }}
        style={styles.headerIconWrapper}
      >
        <Icon name="musical-notes" />
      </TouchableOpacity>
    );

    const playButton = (
      (!playlistLaunched && tracks.length > 0) && (
        <TouchableOpacity
          onPress={() => {
            getNextTrackByVote(playlistId)
              .then((nextTrack) => {
                changePlaylist(playlistId);
                changeTrack(nextTrack);
                // console.log(nextTrack);
                deleteTrackFromPlaylist(nextTrack.id, playlistId)
                  .then(() => {
                    this.setState({ playlistLaunched: true });
                    socket.emit('deleteMusic', playlistId);
                  })
                  .catch(error => console.error(error));
              })
              .catch(error => console.log(error));
          }}
          style={styles.playButton}
        >
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
      )
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

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
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
          <Components.TrackListInPlaylist
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
            isUserInPlaylist={isUserInPlaylist}
            editor={editor}
            pos={pos}
            onMoveEnd={(data) => {
              this.setState({ tracks: data.data });
              moveTrackOrder(playlistId, data.row._id, data.to)
                .then(() => {
                  this._onRefresh();
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          />
        </View>
        { playButton }
        <Components.AddFloatingButton
          handlePress={() => this.setModalVisible(true)}
          icon="addMusic"
        />
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
  },
  playerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  playButton: {
    height: 50,
    width: 180,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1db954',
    lineHeight: 1,
    borderRadius: 25,
    margin: (Dimensions.get('window').width - 180) / 2,
  },
  playText: {
    color: 'white',
    textTransform: 'uppercase',
  },
});

export default Playlist;

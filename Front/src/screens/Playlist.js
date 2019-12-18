import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Alert,
} from 'react-native';
import { Icon } from 'native-base';
import Components from '../components';
import {
  getMusicsByVote, isAdmin, getMyVotesInPlaylist, getNextTrackByVote,
  isEditor, moveTrackOrder, deleteTrackFromPlaylist, getEditRestriction, getPlaylistName,
} from '../../API/BackApi';
import { Colors, Typography, Buttons } from '../styles';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      admin: false,
      editor: false,
      stockedTracks: [],
      tracks: [],
      playing: null,
      refreshing: false,
      modalVisible: false,
      myVotes: [],
      playlistLaunched: false,
      pos: 0,
    };
    this.onRefreshSignal = this._onRefreshSignal.bind(this);
    this.onRefreshPermissionSignal = this._onRefreshPermissionSignal.bind(this);
    props.socket.on('refresh', this.onRefreshSignal);
    props.socket.on('refreshPermissions', this.onRefreshPermissionSignal);
  }

  componentDidMount(): void {
    const { navigation, socket } = this.props;
    const playlistId = navigation.getParam('playlistId');
    this._isMounted = true;

    socket.emit('userJoinedPlaylist', playlistId);
    this.isAdminAndIsEditor();
    this.getName();
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
      console.log('[Socket Server] : refresh signal received');
      this.isAdminAndIsEditor();
      this.updateMyVotes()
        .then(() => {
          this.updateTracks();
        })
        .catch(error => console.log(error));
    }
  };

  _onRefreshPermissionSignal = () => {
    if (this._isMounted) {
      console.log('[Socket Server] : refresh because a change of parameters received');
      this.getName();
      this.isAdminAndIsEditor();
    }
  };

  _onRefresh = () => {
    const { navigation } = this.props;
    const roomType = navigation.getParam('roomType');
    this.isAdminAndIsEditor();
    this.getName();
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

  isAdminAndIsEditor = () => {
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
                  } else {
                    this.setState({ editor: false });
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
        } else {
          isEditor(playlistId, userId, 0)
            .then((response) => {
              if (response === true) {
                this.setState({ editor: true });
              } else {
                this.setState({ editor: false });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getName = () => {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    getPlaylistName(playlistId)
      .then((name) => {
        this.setState({ name });
      })
      .catch(error => console.log(error));
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
      name,
    } = this.state;
    const {
      navigation, changeTrack, changePlaylist, loggedUser, socket,
    } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');
    const authorId = navigation.getParam('authorId');
    const isUserInPlaylist = navigation.getParam('isUserInPlaylist');
    const userId = loggedUser._id;
    const playButton = (
      (!playlistLaunched && tracks.length > 0 && admin) && (
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
        >
          <Icon name="musical-notes" style={Typography.icon} />
        </TouchableOpacity>
      )
    );

    return (
      <View style={styles.main_container}>
        <View style={styles.screenHeader}>
          <View style={Typography.headerSidesContainerStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PlaylistSettings', {
                  playlistId, isAdmin: admin, authorId, roomType, name,
                });
              }}
              style={Typography.iconWrapper}
            >
              <Icon name="settings" style={Typography.icon} />
            </TouchableOpacity>
          </View>
          <View style={[styles.screenHeader, { width: 'auto', padding: 0, flex: 8 }]}>
            <Text
              style={styles.screenHeaderText}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
          <View style={Typography.headerSidesContainerStyle}>
            { playButton }
          </View>
        </View>
        <Components.AddMusicModal
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          playlistId={playlistId}
          updateTracks={this.updateTracks}
          userId={userId}
          roomType={roomType}
        />
        <View>
          <Components.SearchBar
            updateSearchedText={null}
            searchTracks={this.searchTracks}
            autoSearch
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionContent}>
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
        </View>
        <Components.AddFloatingButton
          handlePress={() => this.setModalVisible(true)}
          icon="addMusic"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  screenHeaderWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.darkestGrey,
  },
  screenHeader: {
    ...Typography.screenHeader,
  },
  screenHeaderText: {
    ...Typography.screenHeaderText,
  },
  section: {
    ...Typography.section,
  },
  sectionContent: {
    ...Typography.sectionContent,
  },
  playerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  playText: {
    ...Buttons.text,
  },
});

export default Playlist;

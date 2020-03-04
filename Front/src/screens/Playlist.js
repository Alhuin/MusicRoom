import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Alert, AppState, SafeAreaView,
} from 'react-native';
import { Icon } from 'native-base';
import MusicControl from 'react-native-music-control';
import Components from '../components';
import {
  getMusicsByVote, isAdmin, getMyVotesInPlaylist, getNextTrackByVote,
  isEditor, moveTrackOrder, getEditRestriction, getPlaylistName, deleteTrackFromPlaylistRight,
  deleteTrackFromPlaylist, getNextRadioTrack, setNowPlaying, getNowPlaying, getDelegatedPlayerAdmin,
} from '../../API/BackApi';
import AddFloatingButton from '../containers/AddFloatingButton';
import { Colors, Typography, Buttons } from '../styles';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      admin: false,
      editor: false,
      tracks: [],
      filteredTracks: [],
      playing: null,
      refreshing: false,
      modalVisible: false,
      myVotes: [],
      playlistLaunched: false,
      pos: 0,
      appState: AppState.currentState,
      nowPlaying: null,
      delegated: false,
    };

    // this.onRefresh = this._onRefresh.bind(this);
    // this.onRefreshPermissionSignal = this._onRefreshPermissionSignal.bind(this);

    props.socket.on('refresh', () => {
      console.log('refresh signal recieved');
      this._onRefresh();
    });
    props.socket.on('refreshPermissions', () => {
      console.log('refreshPermissions recieved');
      this._onRefreshPermissionSignal();
    });

    props.socket.on('playlistEnd', () => {
      console.log('playlist End recieved');
      if (this._isMounted) {
        this.setState({ playlistLaunched: false });
      }
    });

    props.socket.on('deleted', (trackId, nextIndex) => {
      if (props.playlistType === 'radio' && props.track.id === trackId) {
        props.setNextIndex(nextIndex);
      }
    });

    props.socket.on('kick', () => {
      props.changeTrack(null);
      props.setPlayerOpen(false);
      props.navigation.goBack();
    });

    props.socket.on('refreshDelegatedPermissions', () => {
      props.changeTrack(null);
      props.setPlayerOpen(false);
      this._onRefresh();
    });
  }


  componentDidMount(): void {
    const { navigation, socket } = this.props;
    const roomType = navigation.getParam('roomType');
    const playlistId = navigation.getParam('playlistId');
    this._isMounted = true;

    this._focusListener = navigation.addListener('didFocus', () => {
      console.log(`emited userJoindedPlaylist ${playlistId}`);
      socket.emit('userJoinedPlaylist', playlistId);
    });

    this._blurListener = navigation.addListener('willBlur', () => {
      console.log(`emited userLeavedPlaylist ${playlistId}`);
      socket.emit('userLeavedPlaylist', playlistId);
    });

    getNowPlaying(playlistId)
      .then((data) => {
        if (data !== null) {
          const { nowPlaying } = this.state;
          if (nowPlaying !== data.nowPlaying) {
            this.setState({ nowPlaying: data.nowPlaying });
          }
        }
      })
      .catch(error => console.log(error));

    // Follow Appstate changes
    AppState.addEventListener('change', this._handleAppStateChange);

    this.isAdminEditorDelegated();
    this.getName();
    this.updateMyVotes()
      .then((votes) => {
        this.updateTracks(roomType, playlistId, votes)
          .then(({ tracks, myVotes }) => this.setState({ tracks, filteredTracks: tracks, myVotes }))
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  componentWillUnmount(): void {
    this._isMounted = false;
    this._focusListener.remove();
    this._blurListener.remove();
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._onChangedPage();
  }

  _handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      const { socket, navigation } = this.props;
      const { playlistId } = navigation.state.params;

      socket.emit('userJoinedPlaylist', playlistId);
      console.log(`emited userJoindedPlaylist ${playlistId}`);
      this._onRefresh();
    }
    this.setState({ appState: nextAppState });
  };

  _onChangedPage = () => {
    const { playing } = this.state;
    if (playing !== null) {
      playing.stop();
    }
  };

  _onRefreshPermissionSignal = () => {
    if (this._isMounted) {
      console.log('[Socket Server] : refresh because a change of parameters received');
      this.getName();
      this.isAdminEditorDelegated();
    }
  };

  _onRefresh = () => {
    if (this._isMounted) {
      const { navigation } = this.props;
      const roomType = navigation.getParam('roomType');
      const playlistId = navigation.getParam('playlistId');
      this.isAdminEditorDelegated();
      this.getName();
      getNowPlaying(playlistId)
        .then((data) => {
          if (data !== null) {
            this.setState({ nowPlaying: data.nowPlaying });
          }
        })
        .catch(error => console.log(error));
      if (roomType === 'party') {
        this.updateMyVotes()
          .then((votes) => {
            this.updateTracks(roomType, playlistId, votes)
              // eslint-disable-next-line max-len
              .then(({ tracks, myVotes }) => this.setState({ tracks, filteredTracks: tracks, myVotes }))
              .catch(error => console.log(error));
          })
          .catch(error => console.log(error));
      } else if (roomType === 'radio') {
        this.updateTracks(roomType, playlistId, null)
          .then(({ tracks }) => this.setState({ tracks, filteredTracks: tracks }))
          .catch(error => console.log(error));
      }
    }
  };

  setModalVisible = () => {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  };

  updateTracks = (roomType, playlistId, votes) => new Promise((resolve, reject) => {
    getMusicsByVote(playlistId, roomType)
      .then(response => resolve({ tracks: response, filteredTracks: response, myVotes: votes }))
      .catch(error => reject(error));
  });

  updateMyVotes = () => new Promise((resolve, reject) => {
    const { navigation, loggedUser } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const userId = loggedUser._id;
    getMyVotesInPlaylist(userId, playlistId)
      .then(votes => resolve(votes))
      .catch(error => reject(error));
  });

  isAdminEditorDelegated = () => {
    const { navigation, loggedUser } = this.props;
    const userId = loggedUser._id;
    const playlistId = navigation.getParam('playlistId');
    let admin = false;

    isAdmin(userId, playlistId)
      .then((response) => {
        if (response === true) {
          admin = true;
        }
        getDelegatedPlayerAdmin(playlistId)
          .then((res) => {
            if (String(userId) === String(res)) {
              this._isEditor(admin, true);
            } else {
              this._isEditor(admin, false);
            }
          })
          .catch((error) => {
            this._isEditor(admin, false);
            console.error(error);
          });
      })
      .catch((error) => {
        this._isEditor(false);
        console.error(error);
      });
  };

  _isEditor = (admin, delegated) => {
    const { navigation, loggedUser } = this.props;
    const userId = loggedUser._id;
    const playlistId = navigation.getParam('playlistId');
    let pos = 0;
    getEditRestriction(playlistId)
      .then((data) => {
        if (data === 'EVENT_RESTRICTED') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              pos = position;
            }, error => Alert.alert(`${error.message}\n Position introuvable.`),
            { enableHighAccuracy: false, timeout: 10000 },
          );
        }
        isEditor(playlistId, userId, pos)
          .then((response) => {
            if (response === true) {
              this.setState({
                editor: true, admin, pos, delegated,
              });
            } else {
              this.setState({
                editor: false, admin, pos, delegated,
              });
            }
          })
          .catch((error) => {
            this.setState({
              editor: false, admin, pos, delegated,
            });
            console.error(error);
          });
      })
      .catch((error) => {
        this.setState({ admin, delegated });
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
    let { filteredTracks } = this.state;
    const { tracks } = this.state;
    if (text !== '') {
      filteredTracks = tracks.filter(track => track.title.search(new RegExp(text, 'i')) > -1
        || track.artist.search(new RegExp(text, 'i')) > -1);
    }
    this.setState({ filteredTracks });
  };

  deleteTrack = (trackId, playlistId, userId) => {
    const { socket } = this.props;
    deleteTrackFromPlaylistRight(trackId, playlistId, userId)
      .then((data) => {
        socket.emit('deleteMusic', playlistId, trackId, data.index);
      })
      .catch(error => console.log(error));
  };

  _onForward = () => {
    const {
      playlistId,
      socket,
      track,
      playlistType,
      nextIndex,
      setNextIndex,
    } = this.props;

    if (playlistType === 'party') {
      if (track !== null) { // Playlist Launched, delete currentTrack & getNextTrack
        deleteTrackFromPlaylist(track.id, playlistId)
          .then(() => {
            // socket.emit('deleteMusic', playlistId);
            this._nextTrackByVote(playlistId);
          })
          .catch(error => console.log(error));
      } else {
        this._nextTrackByVote(playlistId);
      }
      socket.emit('musicChanged', playlistId);
    } else {
      this._nextRadioTrack(playlistId, nextIndex);
      setNextIndex(-1);
    }
  };

  _nextRadioTrack = (playlistId, nextIndex) => {
    const {
      track,
      changing,
      setCurrentPosition,
      setTotalLength,
      changeTrack,
      setNextIndex,
    } = this.props;
    const currentTrackId = track === null ? null : track.id;

    getNextRadioTrack(playlistId, currentTrackId, nextIndex)
      .then((nextTrack) => {
        changing(true);
        setTimeout(() => {
          setCurrentPosition(0);
          setTotalLength(1);
          changing(false);
          changeTrack(nextTrack);
          setNextIndex(-1);
          this._setBackGroundTrack(playlistId, nextTrack);
        });
      })
      .catch(error => console.log(error));
  };

  _nextTrackByVote = (playlistId) => {
    const {
      audioElement,
      changing,
      changeTrack,
      changePlaylist,
      changePlaylistType,
      setTotalLength,
      setCurrentPosition,
      socket,
      setPlayerOpen,
    } = this.props;

    getNextTrackByVote(playlistId)
      .then((nextTrack) => { // Not last track in playlist
        if (Object.keys(nextTrack).length) {
          audioElement && audioElement.seek(0);
          changing(true);
          setTimeout(() => {
            setCurrentPosition(0);
            setTotalLength(1);
            changing(false);
            changeTrack(nextTrack);
            this._setBackGroundTrack(playlistId, nextTrack);
          }, 0);
        } else { // playlist end reached
          MusicControl.resetNowPlaying();
          changeTrack(null);
          changePlaylist('');
          changePlaylistType('');
          setTotalLength(1);
          setCurrentPosition(0);
          setPlayerOpen(false);
          socket.emit('playlistEnd', playlistId);
        }
      })
      .catch(error => console.log(error));
  };

  _setBackGroundTrack = (playlistId, backgroundTrack) => {
    setNowPlaying(playlistId, backgroundTrack.id)
      .then(() => {
        const {
          paused,
          isPaused,
          playlistType,
          socket,
        } = this.props;

        socket.emit('musicChanged', playlistId);
        // Enable buttons
        MusicControl.enableBackgroundMode(true);
        MusicControl.enableControl('play', true);
        MusicControl.enableControl('pause', true);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', playlistType === 'radio');
        MusicControl.enableControl('closeNotification', true, { when: 'always' });

        MusicControl.updatePlayback({
          state: isPaused === true ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING,
        });

        // Background events
        MusicControl.on('play', () => {
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
          });
          paused(false);
        });
        MusicControl.on('pause', () => {
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED,
          });
          paused(true);
        });
        MusicControl.on('nextTrack', () => this._onForward());

        // Displayed infos
        MusicControl.setNowPlaying({
          title: backgroundTrack.title,
          artwork: backgroundTrack.albumArtUrl,
          artist: backgroundTrack.artist,
          album: backgroundTrack.album,
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    const {
      tracks, playing, refreshing, modalVisible, admin, myVotes, editor, playlistLaunched, pos,
      name, nowPlaying, delegated, filteredTracks,
    } = this.state;
    const {
      navigation, changeTrack, changePlaylist, loggedUser, changePlaylistType, setPlayerOpen,
      playlistId, playerOpen, socket,
    } = this.props;
    const paramPlaylistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');
    const authorId = navigation.getParam('authorId');
    const isUserInPlaylist = navigation.getParam('isUserInPlaylist');
    const userId = loggedUser._id;
    let forEditor = (null);
    if (editor) {
      forEditor = (
        <AddFloatingButton
          handlePress={() => this.setModalVisible(true)}
          icon="addMusic"
        />
      );
    }
    const playButton = (
      (!playlistLaunched && tracks.length > 0 && (admin || roomType === 'radio') && (delegated || roomType === 'radio')) && (
        <TouchableOpacity
          onPress={() => {
            const {
              changing,
              setTotalLength,
              setCurrentPosition,
              paused,
            } = this.props;
            if (roomType === 'party') {
              setNowPlaying(playlistId, null) // reset previous nowPlaying
                .then(() => {
                  getNextTrackByVote(paramPlaylistId)
                    .then((nextTrack) => {
                      paused(true);
                      if (Object.keys(nextTrack).length) {
                        changing(true);
                        setTimeout(() => {
                          setCurrentPosition(0);
                          setTotalLength(1);
                          changing(false);
                          changeTrack(nextTrack);
                          changePlaylist(paramPlaylistId);
                          changePlaylistType(roomType);
                          this.setState({ playlistLaunched: true });
                          this._setBackGroundTrack(paramPlaylistId, nextTrack);
                          if (!playerOpen) {
                            setPlayerOpen(true);
                          }
                        }, 0);
                      } else {
                        if (playerOpen) {
                          setPlayerOpen(false);
                        }
                        MusicControl.resetNowPlaying();
                        changeTrack(null);
                        changePlaylist('');
                        changePlaylistType('');
                        setTotalLength(1);
                        setCurrentPosition(0);
                      }
                    })
                    .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
            } else {
              setNowPlaying(playlistId, null) // reset previous nowPlaying
                .then(() => {
                  this.setState({ playlistLaunched: true });
                  this._nextRadioTrack(paramPlaylistId, 0);
                  if (!playerOpen) {
                    setPlayerOpen(true);
                  }
                  changePlaylist(paramPlaylistId);
                  changePlaylistType(roomType);
                })
                .catch(error => console.log(error));
            }
          }}
        >
          <Icon name="musical-notes" style={Typography.icon} />
        </TouchableOpacity>
      )
    );

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.screenHeader }}>
        <View style={styles.main_container}>
          <View style={styles.screenHeader}>
            <View style={Typography.headerSidesContainerStyle}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PlaylistSettings', {
                    playlistId: paramPlaylistId, isAdmin: admin, authorId, roomType, name,
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
            playlistId={paramPlaylistId}
            updateTracks={() => this.updateTracks(roomType, paramPlaylistId)}
            userId={userId}
            roomType={roomType}
          />
          <View>
            <Components.SearchBar
              updateSearchedText={null}
              searchTracks={this.searchTracks}
              autoSearch
              type="search"
            />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionContent}>
              <Components.TrackListInPlaylist
                tracks={filteredTracks}
                updatePlaying={this.updatePlaying}
                deleteTrackInPlaylist={trackId => this.deleteTrack(trackId, paramPlaylistId,
                  userId)}
                playing={playing}
                nowPlaying={nowPlaying}
                playlistId={paramPlaylistId}
                refreshing={refreshing}
                onRefresh={this._onRefresh}
                userId={userId}
                roomType={roomType}
                myVotes={myVotes}
                isUserInPlaylist={isUserInPlaylist}
                editor={editor}
                pos={pos}
                admin={admin}
                onMoveEnd={(id, newPosition) => {
                  moveTrackOrder(paramPlaylistId, id, newPosition)
                    .then(() => {
                      socket.emit('musicMoved', paramPlaylistId);
                      // this._onRefresh();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }}
              />
            </View>
          </View>
          {forEditor}
        </View>
      </SafeAreaView>
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

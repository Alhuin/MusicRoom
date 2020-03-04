import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modalbox';
import MusicControl from 'react-native-music-control';
import AudioPlayer from '../../containers/AudioPlayer';
import PlayerDetails from '../../containers/PlayerDetails';
import MiniPlayer from '../../containers/MiniPlayer';
import {
  deleteTrackFromPlaylist,
  getNextRadioTrack,
  getNextTrackByVote,
  setNowPlaying,
} from '../../../API/BackApi';

export default class AdminPlayer extends Component {
  constructor(props) {
    super(props);

    this.onForward = this._onForward.bind(this);
    this.setBackGroundTrack = this._setBackGroundTrack.bind(this);
    this.nextTrackByVote = this._nextTrackByVote.bind(this);
    this.nextRadioTrack = this._nextRadioTrack.bind(this);
  }

  componentWillUnmount(): void {
    // this.onForward.remove();
    // this.setBackGroundTrack.remove();
    // this.nextTrackByVote.remove();
    // this.nextRadioTrack.remove();
  }

  _onForward = () => {
    const {
      playlistId,
      socket,
      track,
      playlistType,
    } = this.props;

    if (playlistType === 'party') {
      if (track !== null) { // Playlist Launched, delete currentTrack & getNextTrack
        deleteTrackFromPlaylist(track.id, playlistId)
          .then(() => {
            // socket.emit('deleteMusic', playlistId);
            this.nextTrackByVote(playlistId);
          })
          .catch(error => console.log(error));
      } else {
        this.nextTrackByVote(playlistId);
      }
      socket.emit('musicChanged', playlistId);
    } else {
      this.nextRadioTrack(playlistId);
    }
  };

  _nextRadioTrack = (playlistId) => {
    const {
      track,
      changing,
      setCurrentPosition,
      setTotalLength,
      changeTrack,
    } = this.props;
    const currentTrackId = track === null ? null : track.id;
    getNextRadioTrack(playlistId, currentTrackId, -1)
      .then((nextTrack) => {
        changing(true);
        setTimeout(() => {
          setCurrentPosition(0);
          setTotalLength(1);
          changing(false);
          changeTrack(nextTrack);
          this.setBackGroundTrack(playlistId, nextTrack);
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
      setPlayerOpen,
      paused,
      socket,
    } = this.props;

    getNextTrackByVote(playlistId)
      .then((nextTrack) => { // Not last track in playlist
        paused(true);
        if (Object.keys(nextTrack).length) {
          audioElement && audioElement.seek(0);
          changing(true);
          setTimeout(() => {
            setCurrentPosition(0);
            setTotalLength(1);
            changing(false);
            changeTrack(nextTrack);
            paused(false);
            this.setBackGroundTrack(playlistId, nextTrack);
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
    // const { paused } = this.props;
    //
    // // Enable buttons
    // MusicControl.enableBackgroundMode(true);
    // MusicControl.enableControl('play', true);
    // MusicControl.enableControl('pause', true);
    // MusicControl.enableControl('nextTrack', true);
    // MusicControl.enableControl('closeNotification', true, { when: 'always' });
    // // Paused by default
    // MusicControl.updatePlayback({
    //   state: MusicControl.STATE_PAUSED,
    // });
    //
    // // Background events
    // MusicControl.on('play', () => {
    //   MusicControl.updatePlayback({
    //     state: MusicControl.STATE_PLAYING,
    //   });
    //   paused(false);
    // });
    // MusicControl.on('pause', () => {
    //   MusicControl.updatePlayback({
    //     state: MusicControl.STATE_PAUSED,
    //   });
    //   paused(true);
    // });
    // MusicControl.on('nextTrack', () => this._onForward());
    //
    // // Displayed infos
  };

  render() {
    const {
      track, playlistId, loggedUser, paused,
    } = this.props;

    let nowPlayingCover = null;
    let nowPlayingDetails = null;

    if (track !== null) {
      nowPlayingCover = (
        <Image source={{ uri: track.albumArtUrl }} style={{ height: 50, width: 50 }} />
      );
      nowPlayingDetails = {
        title: track.title,
        artist: track.artist,
      };
    }

    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {loggedUser !== null && track !== null && playlistId !== ''
        && (
          <>
            <AudioPlayer onForward={this._onForward} />
            <MiniPlayer
              handlePress={() => this.player.open()}
              onPressPlay={() => {
                paused(false);
              }}
              onPressPause={() => {
                paused(true);
              }}
              cover={nowPlayingCover}
              details={nowPlayingDetails}
              onForward={() => this.onForward()}
            />
            <Modal
              style={styles.playerModal}
              ref={(r) => { this.player = r; }}
              isOpen={false}
              swipeToClose
              backButtonClose
            >
              <PlayerDetails track={track} playlistId={playlistId} onForward={this._onForward} />
            </Modal>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

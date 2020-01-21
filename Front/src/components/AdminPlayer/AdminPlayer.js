import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modalbox';
import MusicControl from 'react-native-music-control';
import AudioPlayer from '../../containers/AudioPlayer';
import PlayerDetails from '../../containers/PlayerDetails';
import MiniPlayer from '../../containers/MiniPlayer';
import { deleteTrackFromPlaylist, getNextTrackByVote } from '../../../API/BackApi';

export default class AdminPlayer extends Component {
  constructor(props) {
    super(props);

    this.onForward = this._onForward.bind(this);
    this.setBackGroundTrack = this._setBackGroundTrack.bind(this);
    this.nextTrackByVote = this._nextTrackByVote.bind(this);
  }

  componentWillUnmount(): void {
    this.onForward.remove();
    this.setBackGroundTrack.remove();
    this.nextTrackByVote.remove();
  }

  _onForward = () => {
    const { playlistId, socket, track } = this.props;

    if (track !== null) { // Playlist Launched, delete currentTrack & getNextTrack
      deleteTrackFromPlaylist(track.id, playlistId)
        .then(() => {
          socket.emit('deleteMusic', playlistId);
          this.nextTrackByVote(playlistId);
        })
        .catch(error => console.log(error));
    } else {
      this.nextTrackByVote(playlistId);
    }
  };

  _nextTrackByVote = (playlistId) => {
    const {
      audioElement,
      changing,
      changeTrack,
      changePlaylist,
      setTotalLength,
      setCurrentPosition,
      socket,
      paused,
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
            this.setBackGroundTrack(nextTrack);
          }, 0);
        } else { // playlist end reached
          MusicControl.resetNowPlaying();
          changeTrack(null);
          changePlaylist('');
          setTotalLength(1);
          setCurrentPosition(0);
          paused(true);
          socket.emit('playlistEnd', playlistId);
        }
      })
      .catch(error => console.log(error));
  };

  _setBackGroundTrack = (backgroundTrack) => {
    MusicControl.setNowPlaying({
      title: backgroundTrack.title,
      artwork: backgroundTrack.albumArtUrl,
      artist: backgroundTrack.artist,
      album: backgroundTrack.album,
    });
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
        album: 'Test',
      };
    }

    console.log(`loggedUser = ${loggedUser}; track = ${track}; playlistId = ${playlistId}`);
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

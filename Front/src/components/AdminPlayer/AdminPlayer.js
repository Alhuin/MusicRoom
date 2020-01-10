import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modalbox';
import AudioPlayer from '../../containers/AudioPlayer';
import PlayerDetails from '../../containers/PlayerDetails';
import MiniPlayer from '../../containers/MiniPlayer';


export default class AdminPlayer extends Component {
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

    return (
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <AudioPlayer />
        {loggedUser !== null && track !== null && playlistId !== ''
        && (
          <>
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
            />
            <Modal
              style={styles.playerModal}
              ref={(r) => { this.player = r; }}
              isOpen={false}
              swipeToClose
              backButtonClose
            >
              <PlayerDetails track={track} playlistId={playlistId} />
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

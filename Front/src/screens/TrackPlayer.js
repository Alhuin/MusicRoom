import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

import Player from '../components/TrackPlayer';
import playlistData from '../assets/testPlaylist.json';
import localTrack from '../assets/pure.m4a';

export default function LandingScreen() {
  const playbackState = usePlaybackState();

  useEffect(() => {
    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  }, []);

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      await TrackPlayer.reset();
      await TrackPlayer.add(playlistData);
      await TrackPlayer.add({
        id: 'local-track',
        url: localTrack,
        title: 'Pure (Demo)',
        artist: 'David Chavez',
        artwork: 'https://picsum.photos/200',
      });
      await TrackPlayer.play();
    } else if (playbackState === TrackPlayer.STATE_PAUSED) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }

  return (
    <View style={styles.container}>
      <Player
        onNext={skipToNext}
        style={styles.player}
        onPrevious={skipToPrevious}
        onTogglePlayback={togglePlayback}
      />
      <Text style={styles.state}>{getStateName(playbackState)}</Text>
    </View>
  );
}

LandingScreen.navigationOptions = {
  title: 'Playlist Example',
};

function getStateName(state) {
  switch (state) {
    case TrackPlayer.STATE_NONE:
      return 'None';
    case TrackPlayer.STATE_PLAYING:
      return 'Playing';
    case TrackPlayer.STATE_PAUSED:
      return 'Paused';
    case TrackPlayer.STATE_STOPPED:
      return 'Stopped';
    case TrackPlayer.STATE_BUFFERING:
      return 'Buffering';
    default:
      return true;
  }
}

async function skipToNext() {
  try {
    await TrackPlayer.skipToNext();
  } catch (error) {
    console.error(error);
  }
}

async function skipToPrevious() {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (error) {
    console.error(error);
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  player: {
    marginTop: 40,
  },
  state: {
    marginTop: 20,
  },
});

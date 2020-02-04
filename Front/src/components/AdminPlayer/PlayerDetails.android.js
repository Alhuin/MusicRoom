import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';

export default class PlayerDetails extends Component {
  onBack() {
    const {
      audioElement, currentPosition, setCurrentPosition, paused, setTotalLength, changing,
    } = this.props;

    if (currentPosition < 10) {
      audioElement && audioElement.seek(0);
      changing(true);
      setTimeout(() => {
        setCurrentPosition(0);
        paused(false);
        setTotalLength(1);
        changing(false);
      }, 0);
    } else {
      audioElement && audioElement.seek(0);
      setCurrentPosition(0);
    }
  }

  // TODO downPress usage
  // onDownPress() {
  //   const { navigation, playlistId } = this.props;
  //
  //   navigation.navigate('Parties', { playlistId });
  // }


  seek(time) {
    const { audioElement, setCurrentPosition, paused } = this.props;
    const newTime = Math.round(time);

    if (audioElement) {
      audioElement.seek(newTime);
    }
    setCurrentPosition(newTime);
    paused(false);
  }

  render() {
    const {
      onDownPress, currentPosition, track, paused, totalLength, isPaused, onForward,
    } = this.props;

    this._onSeek = this.seek.bind(this);
    this._onBack = this.onBack.bind(this);

    // console.log(currentPosition);
    // console.log('length = ');
    // console.log(totalLength);
    return (
      <View style={styles.container}>
        <Header message="Playing From Charts" onDownPress={onDownPress} />
        <AlbumArt url={track.albumArtUrl} />
        <TrackDetails title={track.title} artist={track.artist} />
        <SeekBar
          onSeek={this._onSeek}
          trackLength={totalLength}
          onSlidingStart={() => paused(true)}
          currentPosition={currentPosition}
        />
        <Controls
          // forwardDisabled={selectedTrack === tracks.length - 1}
          backDisabled
          onPressPlay={() => {
            paused(false);
          }}
          onPressPause={() => {
            paused(true);
          }}
          onBack={this._onBack}
          onForward={onForward}
          paused={isPaused}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgb(4,4,4)',
  },
};

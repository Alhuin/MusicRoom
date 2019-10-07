import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import Video from 'react-native-video';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import { getNextTrack, deleteTrackFromPlaylist } from '../../../API/BackApi';

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      repeatOn: false,
      shuffleOn: false,
      track: props.track,
    };
  }

  onBack() {
    const { currentPosition, selectedTrack } = this.state;
    const { audioElement } = this.refs;

    if (currentPosition < 10 && selectedTrack > 0) {
      audioElement && audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        paused: false,
        totalLength: 1,
        isChanging: false,
        selectedTrack: selectedTrack - 1,
      }), 0);
    } else {
      audioElement.seek(0);
      this.setState({
        currentPosition: 0,
      });
    }
  }

  // onDownPress() {
  //   const { navigation, playlistId } = this.props;
  //
  //   navigation.navigate('Parties', { playlistId });
  // }

  onForward() {
    // const { selectedTrack } = this.state;
    // const { track } = this.props;
    const { audioElement } = this.refs;
    const { playlistId } = this.props;
    const { track } = this.state;

    deleteTrackFromPlaylist(track.id, playlistId)
      .then(() => {
        getNextTrack(playlistId)
          .then((nextTrack) => {
            audioElement && audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
              currentPosition: 0,
              totalLength: 1,
              paused: false,
              isChanging: false,
              track: nextTrack,
            }), 0);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  setDuration(data) {
    // console.log(totalLength);
    this.setState({ totalLength: Math.floor(data.duration) });
  }

  setTime(data) {
    // console.log(data);
    this.setState({ currentPosition: Math.floor(data.currentTime) });
  }

  seek(time) {
    const { audioElement } = this.refs;
    const newTime = Math.round(time);

    audioElement.seek(newTime);
    this.setState({
      currentPosition: newTime,
      paused: false,
    });
  }

  render() {
    const {
      selectedTrack, paused, totalLength, currentPosition, repeatOn, shuffleOn, isChanging, track,
    } = this.state;
    const { onDownPress } = this.props;

    const video = isChanging ? null : (
      <Video
        source={{ uri: track.audioUrl }} // Can be a URL or a local file.
        ref="audioElement"
        audioOnly
        playInBackground
        paused={paused} // Pauses playback entirely.
        resizeMode="cover" // Fill the whole screen at aspect ratio.
        // repeat // Repeat forever.
        onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={this.setDuration.bind(this)} // Callback when video loads
        onProgress={this.setTime.bind(this)} // Callback every ~250ms with currentTime
        onEnd={this.onEnd} // Callback when playback finishes
        onError={this.videoError} // Callback when video cannot be loaded
        style={styles.audioElement}
        playWhenInactive
        muted={false}
      />
    );

    return (
      <View style={styles.container}>
        <Header message="Playing From Charts" onDownPress={onDownPress} />
        <AlbumArt url={track.albumArtUrl} />
        <TrackDetails title={track.title} artist={track.artist} />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={totalLength}
          onSlidingStart={() => this.setState({ paused: true })}
          currentPosition={currentPosition}
        />
        <Controls
          onPressRepeat={() => this.setState({ repeatOn: !repeatOn })}
          repeatOn={repeatOn}
          shuffleOn={shuffleOn}
          // forwardDisabled={selectedTrack === tracks.length - 1}
          backDisabled={!selectedTrack}
          onPressShuffle={() => this.setState({ shuffleOn: !shuffleOn })}
          onPressPlay={() => this.setState({ paused: false })}
          onPressPause={() => this.setState({ paused: true })}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={paused}
        />
        {video}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgb(4,4,4)',
  },
  audioElement: {
    height: 0,
    width: 0,
  },
};

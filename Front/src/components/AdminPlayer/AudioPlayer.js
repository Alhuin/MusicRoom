import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';


export default class AudioPlayer extends Component {
  render() {
    const {
      track, isChanging, setTime, setDuration, setAudioElement, isPaused,
    } = this.props;

    let video = null;
    if (!isChanging && track != null) {
      video = (
        <Video
          source={{ uri: track.audioUrl }} // Can be a URL or a local file.
          ref="audioElement"
          audioOnly
          playInBackground
          paused={isPaused} // Pauses playback entirely.
          resizeMode="cover" // Fill the whole screen at aspect ratio.
          // onLoadStart={this.loadStart} // Callback when video starts to load
          onLoad={setDuration.bind(this)} // Callback when video loads
          onProgress={setTime.bind(this)} // Callback every ~250ms with currentTime
          // onEnd={this.onEnd} // Callback when playback finishes
          // onError={this.videoError} // Callback when video cannot be loaded
          playWhenInactive
          muted={false}
        />
      );
      const { audioElement } = this.refs;
      setAudioElement(audioElement);
    }

    return (
      <View>
        { video }
      </View>
    );
  }
}

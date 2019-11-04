import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';


export default class AudioPlayer extends Component {
  render() {
    const {
      track, isChanging, setTime, setDuration, setAudioElement, isPaused,
    } = this.props;

    this._setDuration = setDuration.bind(this);
    this._setTime = setTime.bind(this);

    let video = null;
    if (!isChanging && track != null) {
      video = (
        <Video
          source={{ uri: track.audioUrl }} // Can be a URL or a local file.
          ref={(r) => { this.audioElement = r; }}
          audioOnly
          playInBackground
          paused={isPaused} // Pauses playback entirely.
          resizeMode="cover" // Fill the whole screen at aspect ratio.
          // onLoadStart={this.loadStart} // Callback when video starts to load
          onLoad={this._setDuration} // Callback when video loads
          onProgress={this._setTime} // Callback every ~250ms with currentTime
          // onEnd={this.onEnd} // Callback when playback finishes
          // onError={this.videoError} // Callback when video cannot be loaded
          playWhenInactive
          muted={false}
        />
      );
      setAudioElement(this.audioElement);
    }

    return (
      <View>
        { video }
      </View>
    );
  }
}

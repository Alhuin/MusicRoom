import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';

export default class AudioPlayer extends Component {
  render() {
    const {
      track, isChanging, setAudioElement, isPaused, onForward, setDuration, setTime,
    } = this.props;

    let video = null;
    if (!isChanging && track != null) {
      // console.log(track.audioUrl);
      // console.log(isPaused);
      video = (
        <Video
          source={{ uri: track.audioUrl }} // Can be a URL or a local file.
          ref={(r) => { this.audioElement = r; }}
          audioOnly
          playInBackground
          paused={isPaused} // Pauses playback entirely.
          resizeMode="cover" // Fill the whole screen at aspect ratio.
          onLoadStart={() => { console.log('loadStart'); }} // Callback when video starts to load
          onLoad={setDuration} // Callback when video loads
          onProgress={setTime} // Callback every ~250ms with currentTime
          onEnd={onForward} // Callback when playback finishes
          onError={(error) => { console.log(error); }} // Callback when video cannot be loaded
          playWhenInactive
          muted={false}
          onBuffer={(d) => {
            // console.log(d);
            // console.log('BUFFERING');
          }}
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

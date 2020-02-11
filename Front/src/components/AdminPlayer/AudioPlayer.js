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
      track.audioUrl = track.audioUrl.replace(/\s/g, '%20');
      video = (
        <Video
          source={{ uri: track.audioUrl }} // Can be a URL or a local file.
          // source={{ uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }} // Can be a URL or a local file.
          // source={{ uri: 'http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3' }} // Can be a URL or a local file.
          // source={{ uri: 'http://10.3.1.2:3000/tracks/Lenni-Kim/(2017)%20-%20Yolo/1-01%20-%20Yolo.mp3' }} // Can be a URL or a local file.
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

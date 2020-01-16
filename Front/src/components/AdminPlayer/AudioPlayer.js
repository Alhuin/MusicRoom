import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import { deleteTrackFromPlaylist, getNextTrackByVote } from '../../../API/BackApi';


export default class AudioPlayer extends Component {
  render() {
    const {
      track, isChanging, setTime, setDuration, setAudioElement, isPaused,
    } = this.props;


    function onForward() {
      const {
        playlistId, audioElement, changing, setCurrentPosition,
        setTotalLength, paused, changeTrack, socket, changePlaylist,
      } = this.props;

      deleteTrackFromPlaylist(track.id, playlistId)
        .then(() => {
          socket.emit('deleteMusic', playlistId);
          getNextTrackByVote(playlistId)
            .then((nextTrack) => {
              if (Object.keys(nextTrack).length) {
                audioElement && audioElement.seek(0);
                changing(true);
                setTimeout(() => {
                  setCurrentPosition(0);
                  paused(false);
                  setTotalLength(1);
                  changing(false);
                  changeTrack(nextTrack);
                }, 0);
              } else {
                changeTrack(null);
                changePlaylist('');
                setTotalLength(1);
                setCurrentPosition(0);
              }
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }

    this._setDuration = setDuration.bind(this);
    this._setTime = setTime.bind(this);
    this._onForward = onForward.bind(this);

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
          onEnd={this._onForward} // Callback when playback finishes
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

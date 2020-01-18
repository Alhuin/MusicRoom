import React, { Component } from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import MusicControl from 'react-native-music-control';
import { deleteTrackFromPlaylist, getNextTrackByVote } from '../../../API/BackApi';

export default class AudioPlayer extends Component {
  componentDidMount(): void {
    const { paused } = this.props;

    MusicControl.enableBackgroundMode(true);
    // MusicControl.handleAudioInterruptions(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    // MusicControl.enableControl('stop', false);
    MusicControl.enableControl('nextTrack', true);
    // MusicControl.enableControl('previousTrack', false);
    MusicControl.enableControl('closeNotification', true, { when: 'always' });
    MusicControl.on('play', () => paused(false));
    MusicControl.on('pause', () => paused(true));
    MusicControl.on('nextTrack', this._onForward);
  }

  render() {
    const {
      track, isChanging, setTime, setDuration, setAudioElement, isPaused, paused,
    } = this.props;

    function onForward() {
      const {
        playlistId, audioElement, changing, setCurrentPosition,
        setTotalLength, changeTrack, socket, changePlaylist,
      } = this.props;

      deleteTrackFromPlaylist(track.id, playlistId)
        .then(() => {
          socket.emit('deleteMusic', playlistId);
          changeTrack(null);
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
                  setBackGroundTrack(nextTrack);
                }, 0);
              } else {
                changePlaylist('');
                setTotalLength(1);
                setCurrentPosition(0);
              }
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }

    function setBackGroundTrack(backgroundTrack) {
      console.log(backgroundTrack);
      MusicControl.setNowPlaying({
        title: backgroundTrack.title,
        artwork: backgroundTrack.albumArtUrl, // URL or RN's image require()
        artist: backgroundTrack.artist,
        album: backgroundTrack.album,
        //   genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
        //   duration: 294, // (Seconds)
        //   description: '', // Android Only
        //   color: 0xFFFFFF, // Notification Color - Android Only
        //   date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
        //   rating: 84, // Android Only (Boolean or Number depending on the type)
        // eslint-disable-next-line max-len
        //   notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
      });
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

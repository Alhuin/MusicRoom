import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text, Image,
} from 'react-native';
import SeekBar from '../Player/SeekBar';
import { deleteTrackFromPlaylist, getNextTrackByVote } from '../../../API/BackApi';

export default class MiniPlayer extends React.Component {
  onForward() {
    const {
      playlistId, audioElement, track, changing, setCurrentPosition,
      setTotalLength, paused, changeTrack,
    } = this.props;

    deleteTrackFromPlaylist(track.id, playlistId)
      .then(() => {
        getNextTrackByVote(playlistId)
          .then((nextTrack) => {
            audioElement && audioElement.seek(0);
            changing(true);
            setTimeout(() => {
              setCurrentPosition(0);
              paused(false);
              setTotalLength(1);
              changing(false);
              changeTrack(nextTrack);
            }, 0);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }

  seek(time) {
    const { audioElement, setCurrentPosition, paused } = this.props;
    const newTime = Math.round(time);

    audioElement.seek(newTime);
    setCurrentPosition(newTime);
    paused(false);
  }


  render() {
    const {
      handlePress, isAdmin, cover, details, totalLength,
      onPressPause, onPressPlay, currentPosition, isPaused,
    } = this.props;

    return (
      <TouchableOpacity style={styles.mainContainer} disabled={!isAdmin} onPress={handlePress}>
        <View style={styles.upContainer}>
          <View style={styles.coverContainer}>
            {cover}
          </View>
          <View style={styles.detailsContainer}>
            <Text style={{ fontSize: 16, color: 'white' }}>
              {details.artist.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 12, color: 'white' }}>
              {details.title}
            </Text>
          </View>
          <View style={styles.controls}>
            {!isPaused
              ? (
                <TouchableOpacity onPress={onPressPause}>
                  <View style={styles.playButton}>
                    <Image source={require('../../assets/images/ic_pause_white_48pt.png')} />
                  </View>
                </TouchableOpacity>
              )
              : (
                <TouchableOpacity onPress={onPressPlay}>
                  <View style={styles.playButton}>
                    <Image source={require('../../assets/images/ic_play_arrow_white_48pt.png')} />
                  </View>
                </TouchableOpacity>
              )}
            <View style={{ width: 20 }} />
            <TouchableOpacity
              onPress={() => this.onForward()}
              disabled={false}
            >
              <Image
                style={{ opacity: 0.3 }}
                source={require('../../assets/images/ic_skip_next_white_36pt.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.downContainer}>
          <SeekBar
            onSeek={this.seek.bind(this)}
            trackLength={totalLength}
            onSlidingStart={() => paused(true)}
            currentPosition={currentPosition}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: '#404040',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // elevation: 2,
    width: '100%',
    flexDirection: 'column',
  },
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    height: 50,
    width: 50,
  },
  detailsContainer: {
    flex: 3,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upContainer: {
    // borderWidth: 1,
    // borderColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controls: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: '100%',
  },
});

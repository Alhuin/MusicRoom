import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import SeekBar from '../Player/SeekBar';
import TextScroller from "./TextScroller";


export default class MiniPlayer extends React.Component {

  seek(time) {
    const { audioElement, setCurrentPosition, paused } = this.props;
    const newTime = Math.round(time);

    audioElement.seek(newTime);
    setCurrentPosition(newTime);
    paused(false);
  }

  render() {
    const {
      handlePress, isAdmin, cover, details, totalLength, paused, currentPosition,
    } = this.props;

    return (
      <TouchableOpacity style={styles.mainContainer} disabled={!isAdmin} onPress={handlePress}>
        <View style={styles.description}>
          <View style={styles.coverContainer}>
            {cover}
          </View>
          <View style={styles.detailsContainer}>
            <Text style={{ fontSize: 20, color: 'white' }}>
              {details.artist.toUpperCase()}
            </Text>
            <Text style={{ fontSize: 18, color: 'white' }}>
              {details.title}
            </Text>
          </View>
        </View>
        <View style={styles.controls}>
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
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    backgroundColor: '#404040',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    // elevation: 2,
    width: '100%',
    flexDirection: 'row',
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
    flex: 2,
    height: 70,
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
  description: {
    borderWidth: 1,
    borderColor: 'blue',
  },
  controls: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ProgressComponent } from 'react-native-track-player';

function formatTwoDigits(n) {
  return n < 10 ? '0' + n : n;
}

function formatTime(seconds) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss);
  } else {
    return mm + ':' + formatTwoDigits(ss);
  }
}

class TrackSlider extends ProgressComponent {

  render() {
    const position = formatTime(Math.floor(this.state.position));
    const duration = formatTime(Math.floor(this.state.duration));
    const info = position + ' / ' + duration;

    const progress = this.getProgress() * 100;
    let buffered = this.getBufferedProgress() * 100;
    buffered -= progress;
    if (buffered < 0) buffered = 0;

    return (
      <View style={styles.view}>
        <TouchableWithoutFeedback>
          <View style={styles.bar}>
            <View style={[{width: progress + '%'}, styles.played]} />
            <View style={[{width: buffered + '%'}, styles.buffered]} />
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.info}>{info}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  info: {
    color: '#c0c0c0',
    fontSize: 16,
    fontWeight: '300',
    margin: 10,
  },
  bar: {
    backgroundColor: '#575757',
    height: 5,
    width: '100%',
    margin: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  played: {
    backgroundColor: '#03A9F4',
    height: 5,
  },
  buffered: {
    backgroundColor: '#797979',
    height: 5,
  },
});

module.exports = TrackSlider;
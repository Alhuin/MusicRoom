import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';


export default class MiniPlayer extends React.Component {

  render() {
    const {
      handlePress, isAdmin, cover, details,
    } = this.props;

    return (
      <TouchableOpacity style={styles.mainContainer} disabled={!isAdmin} onPress={handlePress}>
        <View style={styles.coverContainer}>
          {cover}
        </View>
        <View style={styles.detailsContainer}>
          <TextTicker
            style={{ fontSize: 20, color: 'white' }}
            duration={5000}
            loop
            repeatSpacer={50}
          >
            {details.artist}
            {' ● '}
            {details.title}
          </TextTicker>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: 70,
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
});

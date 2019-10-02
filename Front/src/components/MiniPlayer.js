import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';


export default class MiniPlayer extends React.Component {
  render() {
    const {
      handlePress, isAdmin, cover, details
    } = this.props;
    return (
      <TouchableOpacity style={styles.mainContainer} disabled={!isAdmin} onPress={handlePress}>
        <View style={styles.coverContainer}>
          {cover}
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <Text>Now Playing</Text>
          </View>
          <View style={styles.details}>
            <Text>
              {details.artist}
              {' - '}
              {details.album}
            </Text>
            <Text>
              {details.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    // elevation: 2,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    height: 100,
    width: 100,
  },
  detailsContainer: {
    flex: 2,
    backgroundColor: 'yellow',
    height: 120,
  },
  header: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
});

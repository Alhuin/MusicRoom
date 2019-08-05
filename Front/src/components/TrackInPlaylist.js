import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet,
} from 'react-native';
import { Icon } from 'native-base';

class TrackInPlaylist extends React.Component {
  render() {
    const { track, handlePress } = this.props;
    return (
      <TouchableOpacity
        style={styles.main_container}
        onPress={() => {
          handlePress(track.preview);
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: track.cover }}
        />
        <View style={styles.content_container}>
          <View style={styles.header_container}>
            <Text style={styles.title_text}>{track.name}</Text>
          </View>
          <View style={styles.artist_container}>
            <Text style={styles.artist_name}>
              artist :
              {' '}
              {track.artist}
            </Text>
          </View>
          <View style={styles.album_container}>
            <Text style={styles.album_title}>
              album :
              {' '}
              {track.album}
            </Text>
          </View>
          <View style={styles.votes_container}>
            <Icon
              name="arrow-round-up"
              style={{ color: 'white' }}
              onPress={() => alert(`upvote music ${track._id}`)}
            />
            <Icon
              name="arrow-round-down"
              style={{ color: 'white' }}
              onPress={() => alert(`downvote music ${track._id}`)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 120,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
  },
  content_container: {
    flex: 1,
    margin: 5,
  },
  header_container: {
    flex: 3,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 5,
    paddingRight: 5,
    color: 'white',
  },
  artist_container: {
    flex: 5,
    flexDirection: 'row',
  },
  artist_name: {
    fontStyle: 'italic',
    color: 'white',
  },
  album_container: {
    flex: 5,
  },
  album_title: {
    fontSize: 11,
    color: 'grey',
  },
  votes_container: {
    position: 'absolute',
    right: 5,
    top: 10,
    height: 100,
    borderWidth: 1,
    borderColor: 'orange',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
});

export default TrackInPlaylist;

import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Button,
} from 'react-native';
import { addMusicToPlaylist } from '../../API/BackApi';

class TrackInSearch extends React.Component {

  addMusic = () => {
    const {track, playlistId, updateTracks, userId, setModalVisible, displayLoader} = this.props;

    displayLoader();
    addMusicToPlaylist(playlistId, userId, track.title, track.artist.name,
      track.album.title, track.album.cover, track.preview, track.link)
      .then(() => {
        setModalVisible();
        // this.setState({ loading: 0 });
        updateTracks();
      })
      .catch((error) => {
        console.error(error);
        alert('An error occured, please try again later.');
      });
  };

  render() {
    const { track, handlePress } = this.props;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.main_container}
        >
          <TouchableOpacity
            style={styles.previewCover}
            onPress={() => {
              handlePress(track.preview);
            }}
          >
            <Image
              style={styles.image}
              source={{uri: track.album.cover}}
            />
            <Image
              source={require('../assets/images/play.png')}
              style={{height: 80, width: 80, position: 'absolute'}}
            />
          </TouchableOpacity>
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>{track.title}</Text>
            </View>
            <View style={styles.artist_container}>
              <Text style={styles.artist_name}>
                {track.artist.name}
              </Text>
            </View>
            <View style={styles.album_container}>
              <Text style={styles.album_title} numberOfLines={1}>
                {track.album.title}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addContainer}
            onPress={this.addMusic}
          >
            <Image
              source={require('../assets/images/ic_add_circle_outline_white.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  main_container: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    paddingLeft: 10,
    margin: 5,
    justifyContent: 'center',
  },
  title_container: {
    flex: 2,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 5,
    color: 'white',
  },
  artist_container: {
    flex: 1,
    color: 'white',
  },
  artist_name: {
    color: 'white',
  },
  album_container: {
    flex: 1,
  },
  album_title: {
    fontStyle: 'italic',
    color: 'white',
  },
  addContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TrackInSearch;

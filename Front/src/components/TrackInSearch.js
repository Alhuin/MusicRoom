import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Button,
} from 'react-native';
import { addMusicToPlaylist } from '../../API/BackApi';

class TrackInSearch extends React.Component {
  render() {
    const {
      track, handlePress, playlistId, updateTracks, userId, setModalVisible, displayLoader,
    } = this.props;

    return (
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
            source={{ uri: track.album.cover }}
          />
          <Image
            source={require('../assets/images/sound.png')}
            style={{ height: 80, width: 80, position: 'absolute' }}
          />
        </TouchableOpacity>
        <View style={styles.content_container}>
          <View style={styles.header_container}>
            <Text style={styles.title_text}>{track.title}</Text>
          </View>
          <View style={styles.artist_container}>
            <Text style={styles.artist_name}>
              artist :
              {' '}
              {track.artist.name}
            </Text>
          </View>
          <View style={styles.album_container}>
            <Text style={styles.album_title}>
              album :
              {' '}
              {track.album.title}
            </Text>
            <View>
              <Button
                color="#666666"
                title="Add music"
                onPress={() => {
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
                }}
              />
            </View>
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
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#666666',
  },
  album_container: {
    flex: 5,
  },
  album_title: {
    fontSize: 11,
    color: 'grey',
  },

});

export default TrackInSearch;

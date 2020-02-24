import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Alert,
} from 'react-native';
import { addMusicToPlaylist } from '../../../API/BackApi';
import {
  Cards, Colors, Spacing, Typography,
} from '../../styles';

class TrackInSearch extends React.Component {
  addMusic = () => {
    const {
      track, playlistId, userId, setModalVisible, displayLoader, socket, roomType,
    } = this.props;

    displayLoader();
    addMusicToPlaylist(playlistId, userId, track.title, track.artist.name,
      track.album.title, track.album.cover, track.preview, track.link, roomType)
      .then(() => {
        console.log(`emitting addMusic for playlist ${playlistId}`);
        socket.emit('addMusic', playlistId);
        setModalVisible();
      })
      .catch((error) => {
        if (error.status === 400) {
          Alert.alert(
            'Ajout d\'une musique',
            'Cette musique existe déjà dans la playlist !',
          );
          displayLoader();
        } else {
          console.error(error);
          Alert.alert('An error occured, please try again later.');
          displayLoader();
        }
      });
  };

  render() {
    const { track, handlePress } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.card}
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
            source={require('../../assets/images/play.png')}
            style={{ height: 80, width: 80, position: 'absolute' }}
          />
        </TouchableOpacity>
        <View style={styles.content_container}>
          <View style={styles.title_container}>
            <Text style={styles.title_text} numberOfLines={2}>{track.title}</Text>
          </View>
          <View style={styles.artist_container}>
            <Text style={styles.artist_name} numberOfLines={1}>
              {track.artist.name}
            </Text>
          </View>
          <View>
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
            source={require('../../assets/images/ic_add_circle_outline_white.png')}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    ...Cards.card,
    flexDirection: 'row',
    padding: Spacing.small,
    paddingVertical: Spacing.smallest,
  },
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    margin: Spacing.smallest,
    justifyContent: 'center',
  },
  title_container: {
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: Typography.largeFontSize,
    fontWeight: 'bold',
    color: Colors.baseText,
  },
  artist_container: {
    color: Colors.baseText,
  },
  artist_name: {
    color: Colors.baseText,
  },
  album_title: {
    fontStyle: 'italic',
    color: Colors.baseText,
  },
  addContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TrackInSearch;

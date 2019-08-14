import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Alert,
} from 'react-native';
import { Icon } from 'native-base';
import { voteMusic } from '../../API/BackApi';

class TrackInPlaylist extends React.Component {
  _vote = (value) => {
    const {
      track, playlistId, updateTracks, userId,
    } = this.props;
    voteMusic(userId, track._id, playlistId, value)
      .then(() => {
        updateTracks();
      })
      .catch((error) => {
        if (error.status === 400) {
          Alert.alert(error.msg);
        }
      });
  };

  render() {
    const {
      track,
      handlePress,
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
            source={{ uri: track.albumCover }}
          />
          <Image
            source={require('../assets/images/play.png')}
            style={{ height: 80, width: 80, position: 'absolute'  }}
          />
        </TouchableOpacity>
        <View style={styles.content_container}>
          <View style={styles.title_container}>
            <Text style={styles.title_text}>{track.title}</Text>
          </View>
          <View style={styles.artist_container}>
            <Text style={styles.artist_name}>
              {track.artist}
            </Text>
          </View>
          <View style={styles.album_container}>
            <Text style={styles.album_title}>
              {track.album}
            </Text>
          </View>
        </View>
        <View style={styles.voting_container}>
          <View style={styles.note_container}>
            <Text style={{ color: 'white' }}>{track.votes}</Text>
          </View>
          <View style={styles.votes_container}>
            <TouchableOpacity
              style={styles.vote_container}
              onPress={() => this._vote(1)}
            >
              <Icon
                name="arrow-round-up"
                style={{ color: 'green' }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.vote_container}
              onPress={() => this._vote(-1)}
            >
              <Icon
                name="arrow-round-down"
                style={{ color: 'red' }}
              />
            </TouchableOpacity>
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
    justifyContent: 'space-around',
    // borderWidth: 1,
    // borderColor: 'green',
  },
  previewCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    marginTop: 5,
    marginLeft: 5,
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    margin: 5,
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'yellow',
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
  voting_container: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: 'blue',
    flex: 2,
  },
  note_container: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'green',
  },
  votes_container: {
    flex: 1,
    height: 120,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // borderWidth: 1,
    // borderColor: 'orange',
  },
  vote_container: {
    width: 50,
    // borderWidth: 1,
    // borderColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrackInPlaylist;

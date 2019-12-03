import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Alert,
} from 'react-native';
import { Icon } from 'native-base';
import { voteMusic } from '../../../API/BackApi';

// must create two components TrackInRadio and TrackInParty or this one need to be modified

class TrackInPlaylist extends React.Component {
  _vote = (value) => {
    const {
      track, playlistId, userId, socket, pos,
    } = this.props;
    console.log(pos);
    voteMusic(userId, track._id, playlistId, value, pos)
      .then(() => {
        socket.emit('voteMusic', playlistId);
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
      roomType,
      myVoteValue,
      editor,
      pos,
    } = this.props;
    console.log(pos)
    let renderForParty = (null);
    if (roomType === 'party') {
      let arrowUpStyle = { color: 'grey' };
      let arrowDownStyle = { color: 'grey' };
      if (myVoteValue > 0) arrowUpStyle = { color: 'green' };
      else if (myVoteValue < 0) arrowDownStyle = { color: 'red' };
      renderForParty = (
        <View style={styles.voting_container}>
          <View style={styles.note_container}>
            <Text style={{ color: 'white' }}>{track.votes}</Text>
          </View>
          <View style={styles.votes_container}>
            <TouchableOpacity
              style={styles.vote_container}
              onPress={() => {
                if (editor) {
                  this._vote(1);
                }
              }}
              disabled={!editor}
            >
              <Icon
                name="ios-arrow-dropup"
                style={arrowUpStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.vote_container}
              onPress={() => {
                if (editor) {
                  this._vote(-1);
                }
              }}
              disabled={!editor}
            >
              <Icon
                name="ios-arrow-dropdown"
                style={arrowDownStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    let moveDraggable = null;
    let moveEndDraggable = null;
    if (roomType === 'radio' && editor) {
      const { move, moveEnd } = this.props;
      moveDraggable = move;
      moveEndDraggable = moveEnd;
    }
    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.main_container}
          onLongPress={moveDraggable}
          onPressOut={moveEndDraggable}
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
              source={require('../../assets/images/play.png')}
              style={{ height: 80, width: 80, position: 'absolute' }}
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
              <Text style={styles.album_title} numberOfLines={1}>
                {track.album}
              </Text>
            </View>
          </View>
          {renderForParty}
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
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

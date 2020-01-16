import React from 'react';
import {
  TouchableOpacity, Image, View, Text, StyleSheet, Alert, Animated, Easing, Platform,
} from 'react-native';
import { Icon } from 'native-base';
import { voteMusic } from '../../../API/BackApi';
import {
  Cards, Colors, Spacing, Typography,
} from '../../styles';

class TrackInPlaylist extends React.Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1], // not active or active, 0 or 1
              outputRange: [1, 1.1], // it will scale from 1 to 1.1
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { active } = this.props;
    if (active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  _vote = (value) => {
    const {
      track, playlistId, userId, socket, pos,
    } = this.props;
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
      currentTrack,
      admin,
      deleteTrackInPlaylist,
    } = this.props;
    let renderForParty = null;
    let deletionMod = null;
    if (currentTrack && track && currentTrack.id === track._id) {
      renderForParty = (<Text style={Typography.bodyText}>Now playing</Text>);
    } else if (roomType === 'party') {
      let arrowUpStyle = { color: 'grey' };
      let arrowDownStyle = { color: 'grey' };
      if (myVoteValue > 0) arrowUpStyle = { color: 'green' };
      else if (myVoteValue < 0) arrowDownStyle = { color: 'red' };
      renderForParty = (
        <View style={styles.voting_container}>
          <TouchableOpacity
            activeOpacity={0.7}
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
          <View style={styles.note_container}>
            <Text style={{ color: 'white' }}>{track.votes}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
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
      );
      if (admin) {
        deletionMod = (
          <TouchableOpacity
            style={[Typography.iconWrapper, { marginRight: Spacing.small }]}
            onPress={() => {
              deleteTrackInPlaylist(track._id);
            }}
          >
            <Icon
              name="md-close-circle-outline"
              style={Typography.icon}
            />
          </TouchableOpacity>
        );
      }
    } else if (roomType === 'radio' && editor) {
      deletionMod = (
        <TouchableOpacity
          style={[Typography.iconWrapper, { marginRight: Spacing.small }]}
          onPress={() => {
            deleteTrackInPlaylist(track._id);
          }}
        >
          <Icon
            name="md-close-circle-outline"
            style={Typography.icon}
          />
        </TouchableOpacity>
      );
    }
    return (
      <Animated.View style={[styles.card, this._style]}>
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
            <Text style={styles.title_text} numberOfLines={2}>{track.title}</Text>
          </View>
          <View style={styles.artist_container}>
            <Text style={styles.artist_name} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>
          <View>
            <Text style={styles.album_title} numberOfLines={1}>
              {track.album}
            </Text>
          </View>
        </View>
        {renderForParty}
        {deletionMod}
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  card: {
    ...Cards.card,
    flexDirection: 'row',
    padding: 0,
    paddingVertical: 0,
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
    paddingVertical: Spacing.smallest,
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
  voting_container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  note_container: {
    color: Colors.baseText,
    fontSize: Typography.baseFontSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vote_container: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrackInPlaylist;

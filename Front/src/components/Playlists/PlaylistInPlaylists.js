import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import { Cards, Typography, Colors } from '../../styles';

// must create two components PlaylistInParty and PlaylistInRadio or this one need to be modified

export default class PlaylistInPlaylists extends React.Component {
  componentDidMount(): void {
  }

  _pressPlaylist = () => {
    const {
      navigation,
      playlistId,
      roomType,
      authorId,
      isUserInPlaylist,
    } = this.props;
    navigation.push('Playlist', {
      playlistId, roomType, authorId, isUserInPlaylist,
    });
  };

  render() {
    const {
      name, authorName, users, tags,
    } = this.props;
    let tagsStr = '';
    let i = 0;
    Object.keys(tags).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(tags, key)) {
        if (tags[key] === true) {
          if (i === 0) {
            tagsStr += key;
          } else {
            tagsStr += `, ${key}`;
          }
          i += 1;
        }
      }
    });
    return (
      <TouchableOpacity style={Cards.card} onPress={this._pressPlaylist} activeOpacity={0.9}>
        <View style={Cards.cardHeader}>
          <Text
            style={Cards.cardHeaderText}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={{ flex: 5 }}>
            <Text style={Typography.bodyText}>
              Auteur :
              {' '}
              { authorName }
            </Text>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          >
            <Icon name="people" style={Typography.icon} />
            <Text style={{ fontSize: Typography.largerFontSize, color: Colors.baseText }}>
              { users.length }
            </Text>
          </View>
        </View>
        <View style={[styles.cardContent, { justifyContent: 'flex-start', alignItems: 'center', width: '100%' }]}>
          <Text style={Typography.smallText}>
            Tags :
            {` ${tagsStr}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardContent: {
    ...Cards.cardContent,
    flex: 1,
  },
});

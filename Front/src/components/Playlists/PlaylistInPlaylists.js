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
      name,
      authorId,
      isUserInPlaylist,
    } = this.props;
    navigation.push('Playlist', {
      playlistId, roomType, name, authorId, isUserInPlaylist,
    });
  };

  render() {
    const {
      name, authorName, users,
    } = this.props;

    return (
      <TouchableOpacity style={Cards.card} onPress={this._pressPlaylist} activeOpacity={1}>
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
            <Text style={{ fontSize: Typography.largeFontSize, color: Colors.baseText }}>
              { users.length }
            </Text>
          </View>
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

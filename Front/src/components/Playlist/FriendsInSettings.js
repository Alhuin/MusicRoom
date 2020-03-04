import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import { joinPlaylistWithId } from '../../../API/BackApi';
import { Cards, Typography } from '../../styles';

export default class FriendsInSettings extends React.Component {
  render() {
    const {
      friends,
      users,
      admins,
      onRefresh,
      playlistId,
      displayLoader,
      isLoading,
      navigation,
      socket,
    } = this.props;
    return (
      <FlatList
        data={friends}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const friendId = item._id;
            let friendInPlaylist = (null);
            if (!users.includes(friendId) || !admins.includes(friendId)) {
              friendInPlaylist = (
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      displayLoader();
                      joinPlaylistWithId(friendId, playlistId)
                        .then(() => {
                          onRefresh();
                          if (socket) {
                            socket.emit('personalParameterChanged', playlistId, friendId);
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-add" style={styles.icon} />
                </TouchableOpacity>
              );
            }
            const element = (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!isLoading()) {
                        navigation.navigate('UserProfile', { userProfileId: item._id });
                      }
                    }}
                  >
                    <Text
                      style={Cards.cardHeaderText}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                  {friendInPlaylist}
                </View>
              </View>
            );
            return (element);
          }
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  card: {
    ...Cards.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeader: {
    ...Cards.cardHeader,
  },
  iconWrapper: {
    ...Typography.iconWrapper,
  },
  cardContent: {
    ...Cards.cardContent,
  },
  icon: {
    ...Typography.icon,
  },
  iconDisabled: {
    ...Typography.iconDisabled,
  },
});
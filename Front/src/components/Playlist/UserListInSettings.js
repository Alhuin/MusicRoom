import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import {
  userInPlaylistUpgrade, banUserInPlaylist, deleteUserInPlaylist, addFriend,
} from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';
import { Cards, Typography } from '../../styles';

class UserListInSettings extends React.Component {
  render() {
    const {
      users, playlistId, onRefresh, displayLoader, isLoading, roomType, parent, loggedUser,
      isAdmin, navigation, socket,
    } = this.props;
    return (
      <FlatList
        data={users}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const userId = item._id;
            let element = (null);
            const { userChanged } = this.props;
            let isSameUserOrAlreadyInFriend = (null);
            if (!(userId === loggedUser._id || loggedUser.friends.includes(userId))) {
              isSameUserOrAlreadyInFriend = (
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      displayLoader();
                      addFriend(userId, loggedUser._id)
                        .then((newUser) => {
                          if (userChanged !== undefined) {
                            userChanged(newUser);
                          }
                          onRefresh();
                        })
                        .catch((error) => {
                          if (error.status !== 401) console.error(error);
                        });
                    }
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="ios-person-add" style={styles.icon} />
                </TouchableOpacity>
              );
            }
            if (isAdmin !== undefined && isAdmin) {
              element = (
                <View style={Cards.card}>
                  <View style={Cards.cardHeader}>
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
                    <TouchableOpacity
                      onPress={() => {
                        if (!isLoading()) {
                          displayLoader();
                          userInPlaylistUpgrade(playlistId, userId, loggedUser._id)
                            .then(() => {
                              onRefresh();
                              if (socket) {
                                socket.emit('personalParameterChanged', playlistId, userId);
                              }
                            })
                            .catch((error) => {
                              if (error.status !== 401) console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="arrow-up" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (!isLoading()) {
                          displayLoader();
                          deleteUserInPlaylist(playlistId, userId, false, loggedUser._id)
                            .then(() => {
                              if (String(userId) === String(loggedUser._id)) {
                                if (roomType === 'party') {
                                  NavigationUtils.resetStack(parent, 'PartysList', null);
                                } else if (roomType === 'radio') {
                                  NavigationUtils.resetStack(parent, 'RadiosList', null);
                                }
                              } else {
                                onRefresh();
                                if (socket) {
                                  socket.emit('kickOrBanFromPlaylist', playlistId, userId);
                                }
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="md-walk" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        if (!isLoading()) {
                          displayLoader();
                          banUserInPlaylist(playlistId, userId, false, loggedUser._id)
                            .then(() => {
                              if (String(userId) === String(loggedUser._id)) {
                                if (roomType === 'party') {
                                  NavigationUtils.resetStack(parent, 'PartysList', null);
                                } else if (roomType === 'radio') {
                                  NavigationUtils.resetStack(parent, 'RadiosList', null);
                                }
                              } else {
                                onRefresh();
                                if (socket) {
                                  socket.emit('kickOrBanFromPlaylist', playlistId, userId);
                                }
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="md-trash" style={styles.icon} />
                    </TouchableOpacity>
                    {isSameUserOrAlreadyInFriend}
                  </View>
                </View>
              );
            } else {
              element = (
                <View style={Cards.card}>
                  <View style={Cards.cardHeader}>
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
                    {isSameUserOrAlreadyInFriend}
                  </View>
                </View>
              );
            }
            return (element);
          }
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  iconWrapper: {
    ...Typography.iconWrapper,
    flex: 1,
  },
  cardContent: {
    ...Cards.cardContent,
    justifyContent: 'space-between',
  },
  icon: {
    ...Typography.icon,
  },
  iconDisabled: {
    ...Typography.iconDisabled,
  },
});

export default UserListInSettings;

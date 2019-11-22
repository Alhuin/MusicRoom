import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import {
  userInPlaylistUpgrade, banUserInPlaylist, deleteUserInPlaylist, addFriend,
} from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';

class UserListInSettings extends React.Component {
  render() {
    const {
      users,
      playlistId,
      onRefresh,
      displayLoader,
      isLoading,
      roomType,
      parent,
      loggedUser,
      isAdmin,
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
            let isSameUserOrAlreadyInFriend = (
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
                <Icon name="ios-person-add" style={styles.iconsStyle} />
              </TouchableOpacity>
            );
            if (userId === loggedUser._id || loggedUser.friends.includes(userId)) {
              isSameUserOrAlreadyInFriend = (null);
            }
            if (isAdmin !== undefined && isAdmin) {
              element = (
                <View
                  style={styles.row}
                >
                  <Text
                    style={styles.title}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={styles.touchableWrapper}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (!isLoading()) {
                          displayLoader();
                          userInPlaylistUpgrade(playlistId, userId, loggedUser._id)
                            .then(() => {
                              onRefresh();
                            })
                            .catch((error) => {
                              if (error.status !== 401) console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="arrow-up" style={styles.iconsStyle} />
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
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="md-walk" style={styles.iconsStyle} />
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
                              }
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                      style={styles.iconWrapper}
                    >
                      <Icon name="md-trash" style={styles.iconsStyle} />
                    </TouchableOpacity>
                    {isSameUserOrAlreadyInFriend}
                  </View>
                </View>
              );
            } else {
              element = (
                <View
                  style={styles.row}
                >
                  <Text
                    style={styles.title}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={styles.touchableWrapper}
                  >
                    {isSameUserOrAlreadyInFriend}
                  </View>
                </View>
              );
            }
            return (element);
          }
        }
        style={styles.list}
      />
    );
  }
}


const styles = StyleSheet.create({
  list: {
    // backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsStyle: {
    fontSize: 45,
  },
  iconsStyleBlank: {
    fontSize: 45,
    color: 'white',
  },
  authorIconStyle: {
    fontSize: 45,
  },
});
export default UserListInSettings;

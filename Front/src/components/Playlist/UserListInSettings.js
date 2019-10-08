import {
  FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import { Loader } from '../Authentication/Loader';
import { userInPlaylistUpgrade, banUserInPlaylist, deleteUserInPlaylist } from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';

class UserListInSettings extends React.Component {
  render() {
    const {
      users,
      playlistId,
      onRefresh,
      loading,
      displayLoader,
      printLoader,
      isLoading,
      roomType,
      parent,
    } = this.props;
    return (
      <FlatList
        data={users}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const userId = item._id;
            return (
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
                        userInPlaylistUpgrade(playlistId, userId, global.user._id)
                          .then((response) => {
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
                        deleteUserInPlaylist(playlistId, userId, false, global.user._id)
                          .then((response) => {
                            if (String(item._id) === String(global.user._id)) {
                              if (roomType === 'party') {
                                NavigationUtils.resetStack(parent, 'PartysList', null);
                              } else if (roomType === 'radio') {
                                NavigationUtils.resetStack(parent, 'RadiosList', null);
                              }
                            } else {
                              onRefresh();
                            }                          })
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
                        banUserInPlaylist(playlistId, userId, false, global.user._id)
                          .then((response) => {
                            if (String(item._id) === String(global.user._id)) {
                              if (roomType === 'party') {
                                NavigationUtils.resetStack(parent, 'PartysList', null);
                              } else if (roomType === 'radio') {
                                NavigationUtils.resetStack(parent, 'RadiosList', null);
                              }
                            } else {
                              onRefresh();
                            }                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }
                    }}
                    style={styles.iconWrapper}
                  >
                    <Icon name="md-trash" style={styles.iconsStyle} />
                  </TouchableOpacity>
                </View>
              </View>
            );
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

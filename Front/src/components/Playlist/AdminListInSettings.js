import {
  FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import { adminInPlaylistDowngrade, BanUserInPlaylist, DeleteUserInPlaylist } from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';


class AdminListInSettings extends React.Component {
  render() {
    const {
      admins,
      onRefresh,
      authorId,
      playlistId,
      displayLoader,
      isLoading,
      roomType,
      parent,
    } = this.props;
    return (
      <FlatList
        data={admins}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const userId = item._id;
            let doNotTouchTheAuthor = (
              <View
                style={styles.iconsWrapper}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      displayLoader();
                      adminInPlaylistDowngrade(playlistId, userId, global.user._id)
                        .then((response) => {
                          onRefresh();
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                  style={styles.iconTouchable}
                >
                  <Icon name="arrow-down" style={styles.iconsStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      displayLoader();
                      DeleteUserInPlaylist(playlistId, userId, true, global.user._id)
                        .then((response) => {
                          if (String(item._id) === String(global.user._id)) {
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
                  style={styles.iconTouchable}
                >
                  <Icon name="md-walk" style={styles.iconsStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      displayLoader();
                      BanUserInPlaylist(playlistId, userId, true, global.user._id)
                        .then((response) => {
                          if (String(item._id) === String(global.user._id)) {
                            if (roomType === 'party') {
                              NavigationUtils.resetStack(parent, 'PartysList', null);
                            } else if (roomType === 'radio') {
                              NavigationUtils.resetStack(parent, 'RadiosList', null);
                            }
                          } else {
                            onRefresh();
                          }                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                  style={styles.iconTouchable}
                >
                  <Icon name="md-trash" style={styles.iconsStyle} />
                </TouchableOpacity>
              </View>
            );
            if (String(authorId) === String(item._id)) {
              doNotTouchTheAuthor = (
                <View>
                  <Icon name="md-school" style={styles.authorIconStyle} />
                </View>
              );
            }
            return (
              <View
                style={styles.row}
              >
                <Text
                  style={styles.title}
                >
                  {item.name}
                </Text>
                {doNotTouchTheAuthor}
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
    backgroundColor: '#DDDDDD',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  iconsWrapper: {
    height: '100%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  iconTouchable: {
    width: 80,
    alignItems: 'center',
  },
  iconsStyle: {
    fontSize: 45,
  },
  authorIconStyle: {
    fontSize: 45,
    marginRight: 20,
  },
});

export default AdminListInSettings;

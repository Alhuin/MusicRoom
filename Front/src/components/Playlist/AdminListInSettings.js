import {
  FlatList, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import {
  adminInPlaylistDowngrade, banUserInPlaylist, deleteUserInPlaylist, setDelegatedPlayerAdmin,
} from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';


class AdminListInSettings extends React.Component {
  _pressSetDelegatedPlayerAdmin = (userId, playlistId, onRefresh, isLoading, displayLoader) => {
    const { loggedUser } = this.props;
    if (!isLoading()) {
      displayLoader();
      setDelegatedPlayerAdmin(playlistId, userId, loggedUser._id)
        .then(() => {
          onRefresh();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  _pressAdminInPlaylistDowngrade = (userId, item, playlistId, parent,
    roomType, onRefresh, isLoading, displayLoader) => {
    const { loggedUser } = this.props;
    if (!isLoading()) {
      displayLoader();
      adminInPlaylistDowngrade(playlistId, userId, loggedUser._id)
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
  };

  _pressDeleteUserInPlaylist = (userId, item, playlistId, parent,
    roomType, onRefresh, isLoading, displayLoader) => {
    const { loggedUser } = this.props;
    if (!isLoading()) {
      displayLoader();
      deleteUserInPlaylist(playlistId, userId, true, loggedUser._id)
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
  };

  _pressBanUserInPlaylist = (userId, item, playlistId, parent,
    roomType, onRefresh, isLoading, displayLoader) => {
    const { loggedUser } = this.props;
    if (!isLoading()) {
      displayLoader();
      banUserInPlaylist(playlistId, userId, true, loggedUser._id)
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
  };

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
      delegatedPlayerAdmin,
      loggedUser,
      navigation,
    } = this.props;
    return (
      <FlatList
        data={admins}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const userId = item._id;
            let playerUserIcon = (null);
            let authorIcon = (null);
            if (String(authorId) === String(item._id)) {
              authorIcon = (
                <View
                  style={styles.iconWrapper}
                >
                  <Icon name="md-school" style={styles.authorIconStyle} />
                </View>
              );
            }
            if (String(userId) === String(delegatedPlayerAdmin)) {
              playerUserIcon = (
                <View
                  style={styles.iconWrapper}
                >
                  <Icon name="musical-notes" style={styles.iconsStyle} />
                </View>
              );
            } else if (String(loggedUser._id) === String(delegatedPlayerAdmin)) {
              playerUserIcon = (
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => {
                    this._pressSetDelegatedPlayerAdmin(userId, playlistId,
                      onRefresh, isLoading, displayLoader);
                  }}
                >
                  <Icon name="musical-notes" style={styles.iconsStyleBlank} />
                </TouchableOpacity>
              );
            }
            let doNotTouchTheDelegated = (
              <View
                style={styles.touchableWrapper}
              >
                {authorIcon}
                {playerUserIcon}
                <TouchableOpacity
                  onPress={() => {
                    this._pressAdminInPlaylistDowngrade(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="arrow-down" style={styles.iconsStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._pressDeleteUserInPlaylist(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-walk" style={styles.iconsStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._pressBanUserInPlaylist(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-trash" style={styles.iconsStyle} />
                </TouchableOpacity>
              </View>
            );
            if (String(delegatedPlayerAdmin) === String(item._id)) {
              doNotTouchTheDelegated = (
                <View
                  style={styles.touchableWrapper}
                >
                  {authorIcon}
                  {playerUserIcon}
                </View>
              );
            }

            return (
              <View
                style={styles.row}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading()) {
                      navigation.navigate('UserProfile', { userProfileId: item._id });
                    }
                  }}
                >
                  <Text
                    style={styles.title}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
                {doNotTouchTheDelegated}
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
    marginBottom: 5,
    marginTop: 5,
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
    fontSize: 40,
  },
  iconsStyleBlank: {
    fontSize: 40,
    color: 'white',
  },
  authorIconStyle: {
    fontSize: 40,
  },
});

export default AdminListInSettings;

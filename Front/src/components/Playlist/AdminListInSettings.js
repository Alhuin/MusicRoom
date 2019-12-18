import {
  FlatList, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import {
  adminInPlaylistDowngrade, banUserInPlaylist, deleteUserInPlaylist, setDelegatedPlayerAdmin,
} from '../../../API/BackApi';
import NavigationUtils from '../../navigation/NavigationUtils';
import { Cards, Typography } from '../../styles';

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
                <View style={styles.iconWrapper}>
                  <Icon name="md-school" style={styles.iconDisabled} />
                </View>
              );
            }
            if (String(userId) === String(delegatedPlayerAdmin)) {
              playerUserIcon = (
                <View style={styles.iconWrapper}>
                  <Icon name="musical-notes" style={styles.iconDisabled} />
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
                  <Icon name="musical-notes" style={styles.icon} />
                </TouchableOpacity>
              );
            }
            let doNotTouchTheDelegated = (
              <View style={Cards.cardContent}>
                {authorIcon}
                {playerUserIcon}
                <TouchableOpacity
                  onPress={() => {
                    this._pressAdminInPlaylistDowngrade(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="arrow-down" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._pressDeleteUserInPlaylist(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-walk" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._pressBanUserInPlaylist(userId, item, playlistId, parent,
                      roomType, onRefresh, isLoading, displayLoader);
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-trash" style={styles.icon} />
                </TouchableOpacity>
              </View>
            );
            if (String(delegatedPlayerAdmin) === String(item._id)) {
              doNotTouchTheDelegated = (
                <View style={Cards.cardContent}>
                  {authorIcon}
                  {playerUserIcon}
                </View>
              );
            }

            return (
              <View style={Cards.card}>
                <View style={Cards.cardHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!isLoading()) {
                        navigation.navigate('UserProfile', { userProfileId: item._id });
                      }
                    }}
                  >
                    <Text style={Cards.cardHeaderText}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                {doNotTouchTheDelegated}
              </View>
            );
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
  },
  icon: {
    ...Typography.icon,
  },
  iconDisabled: {
    ...Typography.iconDisabled,
  },
});

export default AdminListInSettings;

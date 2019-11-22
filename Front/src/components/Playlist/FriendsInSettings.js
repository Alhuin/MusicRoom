import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import { joinPlaylistWithId } from '../../../API/BackApi';

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
    } = this.props;
    console.log(users);
    console.log(admins);
    console.log(friends);
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
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  }}
                  style={styles.iconWrapper}
                >
                  <Icon name="md-add" style={styles.iconsStyle} />
                </TouchableOpacity>
              );
            }
            const element = (
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

import {
  FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import { addUserToPlaylistAndUnbanned } from '../../../API/BackApi';

class BansListInSettings extends React.Component {
  render() {
    const {
      bans,
      onRefresh,
      playlistId,
      loading,
      displayLoader,
      isLoading,
    } = this.props;
    return (
      <FlatList
        data={bans}
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
                  style={styles.iconsWrapper}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (!isLoading()) {
                        displayLoader();
                        addUserToPlaylistAndUnbanned(playlistId, userId)
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
                    <Icon name="arrow-up" style={styles.iconsStyle} />
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
});

export default BansListInSettings;

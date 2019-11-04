import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
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
                  style={styles.touchableWrapper}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (!isLoading()) {
                        displayLoader();
                        addUserToPlaylistAndUnbanned(playlistId, userId)
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

export default BansListInSettings;

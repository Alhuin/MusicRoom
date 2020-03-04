import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import { addUserToPlaylistAndUnbanned } from '../../../API/BackApi';
import { Cards, Typography } from '../../styles';

class BansListInSettings extends React.Component {
  render() {
    const {
      bans, onRefresh, playlistId, displayLoader, isLoading, navigation, socket,
    } = this.props;
    return (
      <FlatList
        data={bans}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => {
            const userId = item._id;
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
                        addUserToPlaylistAndUnbanned(playlistId, userId)
                          .then(() => {
                            onRefresh();
                            if (socket) {
                              socket.emit('personalParameterChanged', playlistId, userId);
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }
                    }}
                    style={styles.iconWrapper}
                  >
                    <Icon name="arrow-up" style={styles.icon} />
                  </TouchableOpacity>
                </View>
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

export default BansListInSettings;

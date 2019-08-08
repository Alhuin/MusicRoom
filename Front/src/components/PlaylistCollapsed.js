import {
  StyleSheet, Text, View, TouchableWithoutFeedback,
} from 'react-native';
import React, { Component } from 'react';
import { Icon } from 'native-base';

export default class PlaylistCollapsed extends Component { // WTF le nom ?
  _pressPlaylist = () => {
    const { navigation, playlistId } = this.props;
    console.log(`You pressed playlist ${playlistId}`);
    navigation.push('Playlist', { playlistId });
  };

  _longPressPlaylist = () => {
    const { userId } = this.props;
    console.log(`you pressed long ${userId}`)
    alert('ok');
  };

  render() {
    const { name, userId } = this.props;
    // return (
    //   <Button
    //     title={name}
    //     style={styles.container}
    //     onPress={() => {
    //       alert(`Button tapped ! ${name}`);
    //     }}
    //   >
    //     <View style={styles.container}>
    //       <Text numberOfLines={1} style={styles.name}>{name}</Text>
    //     </View>
    //   </Button>
    // );
    return (
      <TouchableWithoutFeedback
        onPress={this._pressPlaylist}
        onLongPress={this._longPressPlaylist}
        style={styles.elementPlay}
      >
        <View
          style={styles.container}
        >
          <Text numberOfLines={3} style={styles.name}>{name}</Text>
          <View
            style={styles.UserAndAuthor}
          >
            <Text style={styles.Author}>Author : {userId}</Text>
            <Icon name="people" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'black',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column',
    height: 150,
    padding: 5,
    backgroundColor: 'white',
  },
  name: {
    // borderWidth: 1.5,
    // borderColor: '#e6e6e6',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'white',
    color: 'black',
  },
  elementPlay: {
    flexDirection: 'row',
  },
  UserAndAuthor: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: 50,
  },
  Author: {
    fontWeight: 'bold',
    color: 'black',
  },
});

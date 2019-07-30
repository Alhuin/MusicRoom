import {
  StyleSheet, Text, View, TouchableWithoutFeedback,
} from 'react-native';
import React, { Component } from 'react';

export default class PlaylistCollapsed extends Component { // WTF le nom ?
  _pressPlaylist = () => {
    const { name } = this.props;
    alert(name);
  };

  _longPressPlaylist = () => {
    alert('Open parameters');
  };

  render() {
    const { name } = this.props;
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
      >
        <View
          style={styles.container}
        >
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    padding: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

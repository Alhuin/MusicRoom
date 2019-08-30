import React from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';

class Home extends React.Component {
  _onPressPlaylists = () => {
    const { navigation, playlistId } = this.props;
    navigation.navigate('Playlists', { playlistId });
  };

  _onPressRadio = () => {
    const { navigation, playlistId } = this.props;
    navigation.navigate('Radio', { playlistId }); // Page a creer
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onPressPlaylists}>
          <View style={styles.cartes}>
            <Text style={styles.textcard}>Party mode</Text>
            <Icon name="musical-notes" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onPressRadio}>
          <View style={styles.cartes}>
            <Text style={styles.textcard}>Radio mode</Text>
            <Icon name="radio" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cartes: {
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#000',
    width: 300,
    height: 300,
    padding: 10,
    alignItems: 'center',
  },
  textcard: {
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 30,
    marginTop: 85,
  },
});

export default Home;

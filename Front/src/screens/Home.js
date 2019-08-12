import React from 'react';
import {
  Text, StyleSheet, View,
} from 'react-native';
import Components from '../components';

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textcard}>Bandeau informatif</Text>
        <View style={styles.cartes}>
          <Text style={styles.textcard}>Last Playlist</Text>
        </View>
        <Text style={styles.textcard}>Player/radio random</Text>
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
  },
});

export default Home;

import React from 'react';
import {
  Text, StyleSheet, View,
} from 'react-native';
import { Icon } from 'native-base';

class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cartes}>
          <Text style={styles.textcard}>Party mode</Text>
          <Icon name="musical-notes" />
        </View>
        <View style={styles.cartes}>
          <Text style={styles.textcard}>Radio mode</Text>
          <Icon name="radio" />
        </View>
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

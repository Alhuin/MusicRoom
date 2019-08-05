import React from 'react';
import {
  FlatList, StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylists } from '../../API/BackApi';

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
  }

  componentDidMount(): void {
    getPlaylists()
      .then((response) => {
        this.setState({ playlists: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { playlists } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={playlists}
          keyExtractor={item => item._id.toString()}
          renderItem={
            ({ item }) => (
              <Components.PlaylistCollapsed
                style={styles.playlist}
                name={item.name}
                playlistId={item._id}
                navigation={navigation}
                userId={-1}
              />
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    // color: 'white',
  },
  playlistContainer: {
    // backgroundColor: '#999966',
    width: '100%',
  },
  playlist: {
    margin: 0,
  },
});

export default Playlists;

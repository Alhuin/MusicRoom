import React from 'react';
import {
  StyleSheet, View,
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
      <View style={{ height: '100%' }}>
        <View style={styles.container}>
          <Components.PlaylistList playlists={playlists} navigation={navigation} />
        </View>
        <Components.AddFloatingButton handlePress={() => alert('addPlaylist')} icon="addPlaylist" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Playlists;

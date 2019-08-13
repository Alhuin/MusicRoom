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
      modalVisible: false,
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

  setModalVisible = () => {
    const { modalVisible } = this.state;
    const visible = !modalVisible;
    this.setState({ modalVisible: visible });
  };

  render() {
    const { playlists, modalVisible } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ height: '100%' }}>
        <Components.AddPlaylistModal
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
        />
        <View style={styles.container}>
          <Components.PlaylistList playlists={playlists} navigation={navigation} />
        </View>
        <Components.AddFloatingButton handlePress={() => this.setModalVisible(true)} icon="addPlaylist" />
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

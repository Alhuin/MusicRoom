import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylistsFiltered, getPlaylistsFilteredByRoom } from '../../API/BackApi';

class Partys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      modalVisible: false,
      refreshing: false,
    };
  }

  componentDidMount(): void {
    const userId = global.user._id;
    getPlaylistsFiltered('party', userId)
    // getPlaylistsFilteredByRoom('party')
      .then((response) => {
        this.setState({ playlists: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.updatePlaylist().then(() => {
      this.setState({ refreshing: false });
    });
  };

  updatePlaylist = () => new Promise((resolve, reject) => {
    const userId = global.user._id;
    getPlaylistsFiltered('party', userId)
    // getPlaylistsFilteredByRoom('party')
      .then((response) => {
        this.setState({ playlists: response.data });
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

  setModalVisible = () => {
    const { modalVisible } = this.state;
    const visible = !modalVisible;
    this.setState({ modalVisible: visible });
    this.updatePlaylist();
  };

  render() {
    const {
      playlists,
      modalVisible,
      refreshing,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ height: '100%' }}>
        <Components.AddPlaylistModal
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          userId={global.user._id}
          roomType="party"
        />
        <View style={styles.container}>
          <Components.PlaylistList
            playlists={playlists}
            navigation={navigation}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            roomType="party"
          />
        </View>
        <Components.AddFloatingButton handlePress={() => this.setModalVisible()} icon="addPlaylist" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Partys;

import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylistsFiltered } from '../../API/BackApi';

class Radios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      modalVisible: false,
      refreshing: false,
    };
  }

  componentDidMount(): void {
    getPlaylistsFiltered('radio', global.user._id)
      .then((playlists) => {
        this.setState({ playlists });
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
    getPlaylistsFiltered('radio', global.user._id)
      .then((playlists) => {
        this.setState({ playlists });
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
          roomType="radio"
          updatePlaylist={this.updatePlaylist}
        />
        <View style={styles.container}>
          <Components.PlaylistList
            playlists={playlists}
            navigation={navigation}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            roomType="radio"
            userId={global.user._id}
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
export default Radios;

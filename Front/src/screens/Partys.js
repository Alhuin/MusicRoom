import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylistsFiltered } from '../../API/BackApi';

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
    const { loggedUser } = this.props;
    console.log(loggedUser);
    getPlaylistsFiltered('party', loggedUser._id)
      .then((playlists) => {
        console.log(playlists);
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
    const { loggedUser } = this.props;
    console.log(loggedUser);
    getPlaylistsFiltered('party', loggedUser._id)
      .then((playlists) => {
        console.log(playlists);
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
    const { navigation, loggedUser } = this.props;
    return (
      <View style={{ height: '100%' }}>
        <Components.AddPlaylistModal
          loggedUser={loggedUser}
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          userId={loggedUser._id}
          roomType="party"
          updatePlaylist={this.updatePlaylist}
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

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
      refreshing: false,
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
    getPlaylists().then(() => {
      this.setState({ refreshing: false });
    });
  };

  setModalVisible = () => {
    const { modalVisible } = this.state;
    const visible = !modalVisible;
    this.setState({ modalVisible: visible });
  };

  render() {
    const { playlists, modalVisible, refreshing } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ height: '100%' }}>
        <Components.AddPlaylistModal
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          userId={global.user._id}
        />
        <View style={styles.container}>
          <Components.PlaylistList
            playlists={playlists}
            navigation={navigation}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
          />
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

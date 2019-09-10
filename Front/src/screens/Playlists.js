import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylists } from '../../API/BackApi';

// this one must be changed to look for specific playlists, the ones in Partys / Radios

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
    // const { navigation } = this.props;
    // console.log(navigation.getParam('roomType'));
    // console.log(navigation.state.params);
    // console.log(navigation);
    getPlaylists()
      .then((response) => {
        // alert(global.user._id);
        //console.log('setState');
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
    // console.log( this.props );
    getPlaylists()
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
    // alert(global.user._id);
    // console.log(navigation);
    // console.log(navigation.state)
    // console.log('RoomType : ' + this.props.navigation.getParam('roomType', 'NO-ROOM-TYPE'));
    // console.log('-------------------------');

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
export default Playlists;

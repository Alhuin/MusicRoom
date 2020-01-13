import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import Components from '../components';
import { getPlaylistsFiltered } from '../../API/BackApi';
import { Colors } from '../styles';

class Partys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      modalVisible: false,
      refreshing: false,
    };
    this.onRefreshSignal = this._onRefreshSignal.bind(this);
    props.socket.on('refresh', this.onRefreshSignal);
  }

  componentDidMount(): void {
    const { socket, navigation } = this.props;

    this.updatePlaylist()
      .catch(error => console.error(error));

    this._isMounted = true;
    this._focusListener = navigation.addListener('didFocus', () => {
      const { shouldUpdate, shouldUpdatePlaylist } = this.props;

      socket.emit('userJoinedPartysList');
      if (shouldUpdate) {
        this.updatePlaylist()
          .then(shouldUpdatePlaylist(false))
          .catch(error => console.error(error));
      }
    });
    this._blurListener = navigation.addListener('willBlur', () => {
      socket.emit('userLeavedPartysList');
    });
  }

  componentWillUnmount(): void {
    this._isMounted = false;
    this._focusListener.remove();
    this._blurListener.remove();
  }

  _onRefreshSignal = () => {
    if (this._isMounted) {
      console.log('[Socket Server] : refresh signal for playlist list received');
      this.updatePlaylist()
        .catch(error => console.error(error));
    }
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.updatePlaylist()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  updatePlaylist = () => new Promise((resolve, reject) => {
    const { loggedUser } = this.props;
    // console.log(loggedUser);
    getPlaylistsFiltered('party', loggedUser._id)
      .then((playlists) => {
        this.setState({ playlists });
        resolve();
      })
      .catch((error) => {
        if (error.status !== 400) {
          console.error(error);
        }
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
    const { navigation, loggedUser, socket } = this.props;
    return (
      <View style={{ height: '100%' }}>
        <Components.AddPlaylistModal
          socket={socket}
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
            userId={loggedUser._id}
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
    backgroundColor: Colors.background,
  },
});
export default Partys;

import React from 'react';
import {
  StyleSheet, View, Alert,
} from 'react-native';
import { Icon } from 'native-base';
import Components from '../components';
import AddFloatingButton from '../containers/AddFloatingButton';
import { getPlaylistsFiltered } from '../../API/BackApi';
import { Colors } from '../styles';

class Radios extends React.Component {
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
    const { socket, navigation, loggedUser } = this.props;

    if (loggedUser.premium) {
      this.updatePlaylist()
        .then(() => console.log('radiosList updated'))
        .catch(error => console.error(error));

      this._isMounted = true;
      this._focusListener = navigation.addListener('didFocus', () => {
        const { shouldUpdate, shouldUpdatePlaylist } = this.props;

        socket.emit('userJoinedRadiosList');
        // console.log(shouldUpdate);
        if (shouldUpdate) {
          this.updatePlaylist()
            .then(shouldUpdatePlaylist(false))
            .catch(error => console.error(error));
        }
      });

      this._blurListener = navigation.addListener('willBlur', () => {
        socket.emit('userLeavedRadiosList');
      });
    } else {
      Alert.alert('Vous devez posséder un compte Premium pour accéder à cette fonctionnalité.');
    }
  }

  componentWillUnmount(): void {
    const { loggedUser } = this.props;

    if (loggedUser.premium) {
      this._isMounted = false;
      this._focusListener.remove();
      this._blurListener.remove();
    }
  }

  _onRefreshSignal = () => {
    const { loggedUser } = this.props;
    if (this._isMounted && loggedUser.premium) {
      console.log('[Socket Server] : refresh signal radiosList received');
      this.updatePlaylist()
        .then(res => console.log(res))
        .catch(error => console.log(error));
    }
  };

  _onRefresh = () => {
    const { loggedUser } = this.props;

    if (loggedUser.premium) {
      this.setState({ refreshing: true });
      this.updatePlaylist()
        .then(() => {
          this.setState({ refreshing: false });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  updatePlaylist = () => new Promise((resolve, reject) => {
    const { loggedUser } = this.props;
    getPlaylistsFiltered('radio', loggedUser._id)
      .then((playlists) => {
        this.setState({ playlists });
        resolve(true);
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
    let render;
    if (loggedUser.premium) {
      render = (
        <View style={{ height: '100%' }}>
          <Components.AddPlaylistModal
            socket={socket}
            loggedUser={loggedUser}
            setModalVisible={this.setModalVisible}
            modalVisible={modalVisible}
            userId={loggedUser._id}
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
              userId={loggedUser._id}
            />
          </View>
          <AddFloatingButton handlePress={() => this.setModalVisible()} icon="addPlaylist" />
        </View>
      );
    } else {
      render = (
        <View style={{ height: '100%' }}>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Icon name="ios-lock" style={{ fontSize: 100, color: Colors.baseText }} />
          </View>
        </View>
      );
    }
    return (render);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
export default Radios;

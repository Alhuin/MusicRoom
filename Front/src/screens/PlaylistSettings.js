import {
  View, StyleSheet, Text, Button,
} from 'react-native';
import React from 'react';
import CollapsibleList from '../components/CollapsibleList';
import AdminListInSettings from '../components/AdminListInSettings';
import UserListInSettings from '../components/UserListInSettings';
import { getAdminsByPlaylistId, getUsersByPlaylistId } from '../../API/BackApi';

class PlaylistSettings extends React.Component {
  state = {
    refreshing: false,
    admins: [],
    users: [],
  };

  componentDidMount(): void {
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this.updateAdmins();
      this.updateUsers();
    }
  }

  _onRefreshAdmins = () => {
    this.setState({ refreshing: true });
    this.updateUsers().then(() => {
      this.setState({ refreshing: false });
    });
  };

  _onRefreshUsers = () => {
    this.setState({ refreshing: true });
    this.updateUsers().then(() => {
      this.setState({ refreshing: false });
    });
  };

  updateAdmins = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    if (isAdmin) {
      getAdminsByPlaylistId(playlistId)
        .then((response) => {
          this.setState({ admins: response });
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    }
  });

  updateUsers = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    if (isAdmin) {
      getUsersByPlaylistId(playlistId)
        .then((response) => {
          this.setState({ users: response });
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    }
  });

  leavingPlaylist = () => {
    const { navigation } = this.props;
    alert('Leaving playlist');
  };

  render() {
    const { refreshing, users, admins } = this.state;
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const rendering = (
      <View>
        <Text
          style={styles.title}
        >
          Paramètres de la playlist
        </Text>
        <Button
          title="Quitter la playlist"
          onPress={() => {
            this.leavingPlaylist();
          }}
          style={styles.leavingButton}
        />
        <CollapsibleList
          title="Liste des Administrateurs"
          playlistId={playlistId}
          isAdmin={isAdmin}
        >
          <AdminListInSettings
            refreshing={refreshing}
            admins={admins}
            onRefresh={this._onRefreshAdmins}
          />
        </CollapsibleList>
        <CollapsibleList
          title="Liste des Utilisateurs"
          playlistId={playlistId}
          isAdmin={isAdmin}
        >
          <UserListInSettings
            refreshing={refreshing}
            users={users}
            onRefresh={this._onRefreshUsers}
          />
        </CollapsibleList>

      </View>
    );
    return (rendering);
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  leavingButton: {

  },
});

export default PlaylistSettings;

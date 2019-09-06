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
      this.updateAdmins().then(() => {
        this.updateUsers();
      });
    }
  }

  _onRefreshAdmins = () => {
    this.setState({ refreshing: true });
    this.updateAdmins().then(() => {
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
    const { users } = this.state;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    if (isAdmin) {
      getAdminsByPlaylistId(playlistId)
        .then((response) => {
          if (users) {
            for (let i = 0; i < users.length; i++) {
              for (let j = 0; j < response.length; j++) {
                if (String(users[i]._id) === String(response[j]._id)) {
                  users.splice(i, 1);
                  i--;
                }
              }
            }
          }
          this.setState({ admins: response, users });
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
    const { admins } = this.state;

    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    if (isAdmin) {
      getUsersByPlaylistId(playlistId)
        .then((response) => {
          if (admins) {
            for (let i = 0; i < admins.length; i++) {
              for (let j = 0; j < response.length; j++) {
                if (String(admins[i]._id) === String(response[j]._id)) {
                  response.splice(j, 1);
                  j--;
                }
              }
            }
          }
          this.setState({ users: response, admins });
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
    let adminOptions = (null);

    if (isAdmin) {
      adminOptions = (
        <View>
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
    }

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
        {adminOptions}
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

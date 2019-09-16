import {
  View, StyleSheet, Text, Button, Switch,
} from 'react-native';
import React from 'react';
import AdminListInSettings from '../components/AdminListInSettings';
import UserListInSettings from '../components/UserListInSettings';
import {
  getAdminsByPlaylistId, getUsersByPlaylistId, getPublicityOfPlaylistById, DeleteUserInPlaylist
} from '../../API/BackApi';

class PlaylistSettings extends React.Component {
  state = {
    refreshing: false,
    admins: [],
    users: [],
    switchValue: false,
  };

  componentDidMount(): void {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this.updateAdmins()
        .then(() => {
          this.updateUsers();
        })
        .catch((error) => {
          console.error(error);
        });
      this.getPublicity(playlistId);
    }
  }


  toggleSwitch = (value) => {
    // connect to back and change publicFlag, and generate a code
    this.setState({ switchValue: value });
  };

  leavingPlaylist = () => {
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');

    if (String(authorId) !== String(global.user._id)) {
      DeleteUserInPlaylist(playlistId, global.user._id, isAdmin)
        .then(() => {
          navigation.navigate('app');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Cannnot leave playlist yet, because you are the author.');
      navigation.goBack();
    }
  };

  getPublicity = (playlistId) => {
    getPublicityOfPlaylistById(playlistId)
      .then((val) => {
        this.setState({ switchValue: val });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // finally, it is the two same refresh functions
  _onRefreshAdmins = () => {
    this.setState({ refreshing: true });
    this.updateAdmins()
      .then(() => {
        this.updateUsers()
          .then(() => {
            this.setState({ refreshing: false });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _onRefreshUsers = () => {
    this.setState({ refreshing: true });
    this.updateAdmins()
      .then(() => {
        this.updateUsers()
          .then(() => {
            this.setState({ refreshing: false });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
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
                  break;
                }
              }
            }
          }
          this.setState({ admins: response, users });
          resolve();
        })
        .catch((error) => {
          console.error(error + ' in updateAdmins');
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
          this.setState({ users: response });
          resolve();
        })
        .catch((error) => {
          console.error(error + ' in updateUsers');
          reject();
        });
    }
  });

  render() {
    const {
      refreshing, users, admins, switchValue,
    } = this.state;
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');
    let adminOptions = (null);
    if (isAdmin) {
      adminOptions = (
        <View>
          <Text>{switchValue ? 'Public' : 'Private'}</Text>
          <Switch
            style={styles.switch}
            onValueChange={this.toggleSwitch}
            value={switchValue}
          />
          <Text> Administrateurs </Text>
          <AdminListInSettings
            refreshing={refreshing}
            admins={admins}
            onRefresh={this._onRefreshAdmins}
            authorId={authorId}
            playlistId={playlistId}
          />
          <Text> Utilisateurs </Text>
          <UserListInSettings
            refreshing={refreshing}
            users={users}
            onRefresh={this._onRefreshUsers}
            playlistId={playlistId}
          />
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
    margin: 10,
  },
  switch: {

  },
});

export default PlaylistSettings;

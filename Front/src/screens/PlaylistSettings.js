import {
  View, StyleSheet, Text, Button, Switch,
} from 'react-native';
import React from 'react';
import AdminListInSettings from '../components/Playlist/AdminListInSettings';
import UserListInSettings from '../components/Playlist/UserListInSettings';
import BansListInSettings from '../components/Playlist/BansListInSettings';
import Loader from '../components/Authentication/Loader';

import {
  getAdminsByPlaylistId, getUsersByPlaylistId, getPublicityOfPlaylistById, deleteUserInPlaylist,
  getBansByPlaylistId, getPlaylistPrivateId, setPublicityOfPlaylist, getDelegatedPlayerAdmin,
} from '../../API/BackApi';
import NavigationUtils from '../navigation/NavigationUtils';

class PlaylistSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      users: [],
      bans: [],
      switchValue: false,
      loading: false,
      privateId: '',
      delegatedPlayerAdmin: '',
    };
  }


  componentDidMount(): void {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this._getPrivateIdAndDelegatedPlayerAdminId(playlistId);
      this.updateUsers()
        .then(() => {
          this.updateAdmins()
            .then(() => {
              this.updateBans()
                .then(() => {
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
      this.getPublicity(playlistId);
    }
  }

  _getPrivateIdAndDelegatedPlayerAdminId = (playlistId) => {
    getPlaylistPrivateId(playlistId)
      .then((privateId) => {
        getDelegatedPlayerAdmin(playlistId)
          .then((delegatedPlayerAdmin) => {
            this.setState({ privateId, delegatedPlayerAdmin });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  displayLoader = () => {
    this.setState({ loading: true });
  };

  hideLoader = () => {
    this.setState({ loading: false });
  };

  toggleSwitch = (value) => {
    // connect to back and change publicFlag, and generate a code
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    setPublicityOfPlaylist(playlistId, value)
      .then(() => {
        this.setState({ switchValue: value });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  leavingPlaylist = () => {
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');

    if (String(authorId) !== String(global.user._id)) {
      deleteUserInPlaylist(playlistId, global.user._id, isAdmin, global.user._id)
        .then(() => {
          if (roomType === 'party') {
            NavigationUtils.resetStack(this, 'PartysList', null);
          } else if (roomType === 'radio') {
            NavigationUtils.resetStack(this, 'RadiosList', null);
          }
        })
        .catch((error) => {
          console.error(error);
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
  _onRefresh = () => {
    console.log('loading is true');
    this.updateAdmins()
      .then(() => {
        this.updateUsers()
          .then(() => {
            this.updateBans()
              .then(() => {
                console.log('loading is false');
                this.hideLoader();
              })
              .catch((error) => {
                console.error(error);
              });
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
          console.error(`${error} in updateAdmins`);
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
          console.error(`${error} in updateUsers`);
          reject();
        });
    }
  });

  updateBans = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
    // const { admins } = this.state;

    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    if (isAdmin) {
      getBansByPlaylistId(playlistId)
        .then((response) => {
          this.setState({ bans: response });
          resolve();
        })
        .catch((error) => {
          console.error(`${error} in updateUsers`);
          reject();
        });
    }
  });

  isLoading = () => {
    const { loading } = this.state;
    return loading;
  };

  render() {
    const {
      users, admins, bans, switchValue, loading, privateId, delegatedPlayerAdmin,
    } = this.state;
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');
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
            displayLoader={this.displayLoader}
            admins={admins}
            onRefresh={this._onRefresh}
            authorId={authorId}
            playlistId={playlistId}
            isLoading={this.isLoading}
            roomType={roomType}
            parent={this}
            delegatedPlayerAdmin={delegatedPlayerAdmin}
          />
          <Text> Utilisateurs </Text>
          <UserListInSettings
            displayLoader={this.displayLoader}
            users={users}
            onRefresh={this._onRefresh}
            playlistId={playlistId}
            isLoading={this.isLoading}
            roomType={roomType}
            parent={this}
          />
          <Text> Bannis </Text>
          <BansListInSettings
            displayLoader={this.displayLoader}
            bans={bans}
            onRefresh={this._onRefresh}
            playlistId={playlistId}
            isLoading={this.isLoading}
          />
        </View>
      );
    }
    const rendering = (
      <View style={{ flex: 1 }}>
        <Text
          style={styles.title}
        >
          Paramètres de la playlist
        </Text>
        <Text
          selectable
        >
          Code privé : {privateId}
        </Text>
        <Button
          title="Quitter la playlist"
          onPress={() => {
            this.leavingPlaylist();
          }}
          style={styles.leavingButton}
        />
        {adminOptions}
        <Loader loading={loading} />
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

import {
  View, StyleSheet, Text, Button, Switch, TouchableOpacity, ScrollView,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
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
      collapsed: true,
    };
  }


  componentDidMount(): void {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this._updateState(playlistId);
    }
  }

  _updateState = (playlistId) => {
    getPlaylistPrivateId(playlistId)
      .then((privateId) => {
        getDelegatedPlayerAdmin(playlistId)
          .then((delegatedPlayerAdmin) => {
            this.setState({ privateId, delegatedPlayerAdmin });
            this.updateAdmins()
              .then(() => {
                this.updateUsers()
                  .then(() => {
                    this.updateBans()
                      .then(() => {
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
            this.getPublicity(playlistId);
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
    const { loading } = this.state;
    if (loading) this.setState({ loading: false });
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
    const { delegatedPlayerAdmin } = this.state;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    // const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');

    if (String(delegatedPlayerAdmin) !== String(global.user._id)) {
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
      alert('Impossible de quitter la playlist tant que vous êtes Délégué au contrôle du Player.');
      // navigation.goBack();
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

  _onRefresh = () => {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    this._updateState(playlistId);
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

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
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
          <View
            style={[styles.subContainer, { justifyContent: 'space-between' }]}
          >
            <Text
              style={styles.subContainerFontStyle}
              // style={styles.subContainerFontStyle}
              // style={{styles.subContainerFontStyle, }}
            >
              {switchValue ? 'Public' : 'Private'}
            </Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
          </View>
          <TouchableOpacity
            onPress={this.toggleExpanded}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>Icônes</Text>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} align="center">
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="md-school" style={styles.iconsStyle} />
              <Text> Auteur </Text>
            </View>
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="musical-notes" style={styles.iconsStyle} />
              <Text> Délégué au Player</Text>
            </View>
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="arrow-down" style={styles.iconsStyle} />
              <Text> Admin. vers Utilisateur </Text>
            </View>
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="arrow-up" style={styles.iconsStyle} />
              <Text> Promotion Utilisateur vers Admin. | Unban</Text>
            </View>
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="md-walk" style={styles.iconsStyle} />
              <Text> Kick </Text>
            </View>
            <View style={styles.iconsDescriptionWrapper}>
              <Icon name="md-trash" style={styles.iconsStyle} />
              <Text> Bannissement </Text>
            </View>
          </Collapsible>
          <Text
            style={[styles.subContainerFontStyle, { textAlign: 'center' }]}
          >
            Administrateurs
          </Text>
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
          <Text
            style={[styles.subContainerFontStyle, { textAlign: 'center' }]}
          >
            Utilisateurs
          </Text>
          <UserListInSettings
            displayLoader={this.displayLoader}
            users={users}
            onRefresh={this._onRefresh}
            playlistId={playlistId}
            isLoading={this.isLoading}
            roomType={roomType}
            parent={this}
          />
          <Text
            style={[styles.subContainerFontStyle, { textAlign: 'center' }]}
          >
            Bannis
          </Text>
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
      <ScrollView style={styles.container}>
        <Text
          style={styles.title}
        >
          Paramètres de la playlist
        </Text>
        <View
          style={[styles.subContainer, { justifyContent: 'center' }]}
        >
          <Button
            title="Quitter la playlist"
            onPress={() => {
              this.leavingPlaylist();
            }}
            style={styles.leavingButton}
          />
        </View>
        <View
          style={styles.subContainer}
        >
          <Text
            selectable
            style={styles.subContainerFontStyle}
          >
            Code privé : {privateId}
          </Text>
        </View>

        {adminOptions}
        <Loader loading={loading} />
      </ScrollView>
    );
    return (rendering);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
  },
  leavingButton: {
    margin: 10,
  },
  subContainer: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconsStyle: {
    fontSize: 45,
  },
  subContainerFontStyle: {
    fontSize: 20,
  },
  iconsDescriptionWrapper: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PlaylistSettings;

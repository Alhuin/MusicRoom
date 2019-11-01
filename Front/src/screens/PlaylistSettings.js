import {
  View, StyleSheet, Text, Button, Switch, TouchableOpacity, ScrollView, Clipboard, Alert, CheckBox,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
import SimpleToast from 'react-native-simple-toast';
import AdminListInSettings from '../components/Playlist/AdminListInSettings';
import UserListInSettings from '../components/Playlist/UserListInSettings';
import BansListInSettings from '../components/Playlist/BansListInSettings';
import SettingsTagCheckbox from '../components/Playlist/SettingsTagCheckbox';
import Loader from '../components/Authentication/Loader';

import {
  getAdminsByPlaylistId, getUsersByPlaylistId, getPublicityOfPlaylistById, deleteUserInPlaylist,
  getBansByPlaylistId, getPlaylistPrivateId, setPublicityOfPlaylist, getDelegatedPlayerAdmin,
  getPlaylistDates, setStartDate, setEndDate, getTags, setTags,
} from '../../API/BackApi';
import NavigationUtils from '../navigation/NavigationUtils';
import DatePickerModal from '../components/Playlists/DatePickerModal';


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
      collapsedSpec: true,
      collapsedTags: true,
      datePickerModalVisible: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000),
      dateType: 0,
      tags: {},
    };
  }


  componentDidMount(): void {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this._updateState(playlistId);
    } else {
      this.getPublicity(playlistId);
      this.getDates(playlistId);
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
            this.getDates(playlistId);
            this.getTags(playlistId);
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
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      setPublicityOfPlaylist(playlistId, value)
        .then(() => {
          this.setState({ switchValue: value });
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
      alert('Impossible de quitter la playlist tant que vous êtes Délégué au contrôle du PlayerDetails.');
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

  getTags = (playlistId) => {
    getTags(playlistId)
      .then((data) => {
        this.setState({ tags: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getDates = (playlistId) => {
    const { navigation } = this.props;
    const roomType = navigation.getParam('roomType');
    if (roomType === 'party') {
      getPlaylistDates(playlistId)
        .then((dates) => {
          this.setState({ startDate: new Date(Date.parse(dates[0])), endDate: new Date(Date.parse(dates[1])) });
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
          console.error(`${error} in updateBans`);
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

  toggleExpandedSpec = () => {
    this.setState({ collapsedSpec: !this.state.collapsedSpec });
  };

  toggleExpandedTags = () => {
    this.setState({ collapsedTags: !this.state.collapsedTags });
  };

  setDatePickerModalVisible = (dateType) => {
    const { datePickerModalVisible } = this.state;
    const visible = !datePickerModalVisible;
    if (dateType !== undefined) {
      this.setState({ dateType, datePickerModalVisible: visible });
    } else {
      this.setState({ datePickerModalVisible: visible });
    }
  };

  onDateChanged = (changedDate) => {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const { dateType, startDate, endDate } = this.state;
    if (dateType === 'start') {
      if (changedDate < endDate) {
        setStartDate(playlistId, changedDate)
          .then((response) => {
            this.setState({ startDate: changedDate });
          })
          .catch((error) => {
            console.error(`${error} in setStartDate`);
          });
      } else {
        Alert.alert('Veuillez choisir une date compatible.');
      }
    } else if (dateType === 'end') {
      if (changedDate > startDate) {
        setEndDate(playlistId, changedDate)
          .then((response) => {
            this.setState({ endDate: changedDate });
          })
          .catch((error) => {
            console.error(`${error} in setEndDate`);
          });
      } else {
        Alert.alert('Veuillez choisir une date compatible.');
      }
    }
  };

  tagsChanged = (tag) => {
    let { tags } = this.state;
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');

    if (tags[tag]) {
      delete tags[tag];
    } else {
      tags[tag] = true;
    }
    tags = this.formatTags(tags);
    setTags(playlistId, tags)
      .then((data) => {
        this.setState({ tags: data });
      })
      .catch((error) => {
        console.error(`${error} in tagsChanged`);
      });
  };

  formatTags = tags => Object.keys(tags);

  render() {
    const {
      users, admins, bans, switchValue, loading, privateId, delegatedPlayerAdmin,
      collapsed, collapsedSpec, collapsedTags, startDate, endDate, datePickerModalVisible, tags,
    } = this.state;
    const { navigation } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');
    let adminOptions = (null);
    let notAdminOptions = (null);
    let collapsibleIcon = (null);
    let collapsibleIconSpec = (null);
    let collapsibleIconTags = (null);
    let specificRoomSettings = (null);
    if (isAdmin) {
      if (collapsed) {
        collapsibleIcon = (
          <Icon name="ios-arrow-up" style={{ marginRight: 5 }} />
        );
      } else {
        collapsibleIcon = (
          <Icon name="ios-arrow-down" style={{ marginRight: 5 }} />
        );
      }
      if (collapsedSpec) {
        collapsibleIconSpec = (
          <Icon name="ios-arrow-up" style={{ marginRight: 5 }} />
        );
      } else {
        collapsibleIconSpec = (
          <Icon name="ios-arrow-down" style={{ marginRight: 5 }} />
        );
      }
      if (collapsedTags) {
        collapsibleIconTags = (
          <Icon name="ios-arrow-up" style={{ marginRight: 5 }} />
        );
      } else {
        collapsibleIconTags = (
          <Icon name="ios-arrow-down" style={{ marginRight: 5 }} />
        );
      }
      if (roomType === 'party') {
        specificRoomSettings = (
          <View>
            <DatePickerModal
              setModalVisible={this.setDatePickerModalVisible}
              DateModalVisible={datePickerModalVisible}
              onDateChanged={this.onDateChanged}
            />
            <TouchableOpacity
              onPress={this.toggleExpandedSpec}
            >
              <View style={styles.header}>
                <Text
                  style={styles.header}
                >
                  Option de Party
                </Text>
                {collapsibleIconSpec}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedSpec}>
              <View>
                <Text>
                  Changer la localisation : (?)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setDatePickerModalVisible('start');
                }}
              >
                <Text>
                  Changer la date de début :
                </Text>
                <Text>
                  {String(startDate)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setDatePickerModalVisible('end');
                }}
              >
                <Text>
                  Changer la date de fin :
                </Text>
                <Text>
                  {String(endDate)}
                </Text>
              </TouchableOpacity>
            </Collapsible>
          </View>
        );
      } else {
        specificRoomSettings = (
          null
        );
      }
      adminOptions = (
        <View>
          <Text
            style={styles.subText}
          >
            Les paramètres sont rafraîchis à chaque modification, et peuvent être modifiés en même temps
            {' '}
            par d'autres utilisateurs ou administrateurs.
          </Text>
          <View
            style={[styles.subContainer, { justifyContent: 'space-between' }]}
          >
            <Text
              style={styles.subContainerFontStyle}
            >
              {switchValue ? 'Publique' : 'Privée'}
            </Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
          </View>
          {specificRoomSettings}
          <TouchableOpacity
            onPress={this.toggleExpandedTags}
          >
            <View style={styles.header}>
              <Text
                style={styles.header}
              >
                Tags
              </Text>
              {collapsibleIconTags}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsedTags} align="center">
            <View
              style={styles.checkboxesWrapper}
            >
              <View
                style={styles.checkboxRow}
              >
                <SettingsTagCheckbox
                  checked={tags.Rock}
                  tagsChanged={this.tagsChanged}
                  tag="Rock"
                />
                <SettingsTagCheckbox
                  checked={tags.Rap}
                  tagsChanged={this.tagsChanged}
                  tag="Rap"
                />
                <SettingsTagCheckbox
                  checked={tags.Classic}
                  tagsChanged={this.tagsChanged}
                  tag="Classic"
                />
              </View>
              <View
                style={styles.checkboxRow}
              >
                <SettingsTagCheckbox
                  checked={tags.Electro}
                  tagsChanged={this.tagsChanged}
                  tag="Electro"
                />
                <SettingsTagCheckbox
                  checked={tags.Reggae}
                  tagsChanged={this.tagsChanged}
                  tag="Reggae"
                />
                <SettingsTagCheckbox
                  checked={tags.Metal}
                  tagsChanged={this.tagsChanged}
                  tag="Metal"
                />
              </View>
              <View
                style={styles.checkboxRow}
              >
                <SettingsTagCheckbox
                  checked={tags.Pop}
                  tagsChanged={this.tagsChanged}
                  tag="Pop"
                />
                <SettingsTagCheckbox
                  checked={tags.Dub}
                  tagsChanged={this.tagsChanged}
                  tag="Dub"
                />
                <SettingsTagCheckbox
                  checked={tags.Country}
                  tagsChanged={this.tagsChanged}
                  tag="Country"
                />
              </View>
            </View>
          </Collapsible>
          <TouchableOpacity
            onPress={this.toggleExpanded}
          >
            <View style={styles.header}>
              <Text
                style={styles.header}
              >
                Légende
              </Text>
              {collapsibleIcon}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsed} align="center">
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
    } else {
      if (roomType === 'party') {
        notAdminOptions = (
          <View>
            <View>
              <Text>
                La playlist est {switchValue ? 'Publique' : 'Privée'}
              </Text>
            </View>
            <View>
              <Text>
                Localisation : (?)
              </Text>
            </View>
            <Text>
              Date de début de l'évènement :
            </Text>
            <Text>
              {String(startDate)}
            </Text>
            <Text>
              Date de fin de l'évènement :
            </Text>
            <Text>
              {String(endDate)}
            </Text>
          </View>
        );
      } else {
        notAdminOptions = (
          <View>
            <View>
              <Text>
                La playlist est {switchValue ? 'Publique' : 'Privée'}
              </Text>
            </View>
          </View>
        );
      }
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
          style={[styles.subContainer, { justifyContent: 'space-between' }]}
        >
          <Text
            selectable
            style={styles.subContainerFontStyle}
          >
            Code privé : {privateId}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(String(privateId));
              SimpleToast.show('Code copié dans le Presse-Papier.');
            }}
          >
            <Icon name="ios-clipboard" style={{ marginRight: 10, fontSize: 35 }} />
          </TouchableOpacity>
        </View>
        {notAdminOptions}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    // textAlign: 'center',
    fontSize: 22,
  },
  switch: {
    marginRight: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  checkboxesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PlaylistSettings;

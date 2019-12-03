import {
  View, StyleSheet, Text, Button, Switch, TouchableOpacity, ScrollView, Clipboard, Alert,
} from 'react-native';
import React from 'react';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
import SimpleToast from 'react-native-simple-toast';
import RadioForm from 'react-native-simple-radio-button';
import AdminListInSettings from '../components/Playlist/AdminListInSettings';
import UserListInSettings from '../components/Playlist/UserListInSettings';
import BansListInSettings from '../components/Playlist/BansListInSettings';
import SettingsTagCheckbox from '../components/Playlist/SettingsTagCheckbox';
import Loader from '../components/Authentication/Loader';

import {
  getAdminsByPlaylistId, getUsersByPlaylistId, getPublicityOfPlaylistById, deleteUserInPlaylist,
  getBansByPlaylistId, getPlaylistPrivateId, setPublicityOfPlaylist, getDelegatedPlayerAdmin,
  getPlaylistDates, setStartDate, setEndDate, getTags, setTags, getEditRestriction,
  setEditRestriction, deletePlaylistByAdmin, getFriends,
} from '../../API/BackApi';
import NavigationUtils from '../navigation/NavigationUtils';
import DatePickerModal from '../components/Playlists/DatePickerModal';
import FriendsInSettings from '../components/Playlist/FriendsInSettings';


class PlaylistSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      users: [],
      bans: [],
      friends: [],
      switchValue: false,
      loading: false,
      privateId: '',
      delegatedPlayerAdmin: '',
      collapsed: true,
      collapsedSpec: true,
      collapsedTags: true,
      collapsedAddFriendToPlaylist: true,
      datePickerModalVisible: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000),
      dateType: 0,
      tags: {},
      radioValue: 0,
      deletePlaylistState: 'Supprimer la Playlist',
      isUser: false,
    };
  }


  componentDidMount(): void {
    this._onRefresh();
  }

  _updateState = (playlistId) => {
    const { loggedUser } = this.props;
    getPlaylistPrivateId(playlistId)
      .then((privateId) => {
        getDelegatedPlayerAdmin(playlistId)
          .then((delegatedPlayerAdmin) => {
            this.setState({ privateId, delegatedPlayerAdmin });
            this.getEditRestriction(playlistId);
            this.getPublicity(playlistId);
            this.getDates(playlistId);
            this.getTags(playlistId);
            this.updateAdmins()
              .then(() => {
                this.updateUsers()
                  .then(() => {
                    this.updateBans()
                      .then(() => {
                        getFriends(loggedUser._id)
                          .then((friends) => {
                            const newFriends = this.sliceFriends(friends);
                            this.setState({ friends: newFriends });
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
    const { navigation, loggedUser } = this.props;
    const { delegatedPlayerAdmin } = this.state;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    // const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');

    if (String(delegatedPlayerAdmin) !== String(loggedUser._id)) {
      deleteUserInPlaylist(playlistId, loggedUser._id, isAdmin, loggedUser._id)
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
      Alert.alert('Impossible de quitter la playlist tant que vous êtes Délégué au Contrôle du Player.');
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

  getEditRestriction = (playlistId) => {
    getEditRestriction(playlistId)
      .then((data) => {
        if (data === 'ALL') {
          this.radioForm.updateIsActiveIndex(0);
          this.setState({ radioValue: 0 });
        } else if (data === 'USER_RESTRICTED') {
          this.radioForm.updateIsActiveIndex(1);
          this.setState({ radioValue: 1 });
        } else if (data === 'ADMIN_RESTRICTED') {
          this.radioForm.updateIsActiveIndex(2);
          this.setState({ radioValue: 2 });
        } else if (data === 'EVENT_RESTRICTED') {
          this.radioForm.updateIsActiveIndex(3);
          this.setState({ radioValue: 3 });
        }
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
          this.setState({
            startDate: new Date(Date.parse(dates[0])),
            endDate: new Date(Date.parse(dates[1])),
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  _onRefresh = () => {
    const { navigation, loggedUser } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const isAdmin = navigation.getParam('isAdmin');
    if (isAdmin) {
      this._updateState(playlistId);
    } else {
      this.updateUsers()
        .then(() => {
          const { isUser } = this.state;
          if (isUser) {
            this.getPublicity(playlistId);
            this.getDates(playlistId);
            this.hideLoader();
            getPlaylistPrivateId(playlistId)
              .then((privateId) => {
                this.setState({ privateId });
                getFriends(loggedUser._id)
                  .then((friends) => {
                    const newFriends = this.sliceFriends(friends);
                    this.setState({ friends: newFriends });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  sliceFriends = (friends) => {
    const { admins, users } = this.state;
    if (users) {
      for (let i = 0; i < friends.length; i += 1) {
        for (let j = 0; j < users.length; j += 1) {
          if (String(users[j]._id) === String(friends[i]._id)) {
            friends.splice(i, 1);
            i -= 1;
            break;
          }
        }
      }
    }
    if (admins) {
      for (let i = 0; i < friends.length; i += 1) {
        for (let j = 0; j < admins.length; j += 1) {
          if (String(admins[j]._id) === String(friends[i]._id)) {
            friends.splice(i, 1);
            i -= 1;
            break;
          }
        }
      }
    }
    return friends;
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
            for (let i = 0; i < users.length; i += 1) {
              for (let j = 0; j < response.length; j += 1) {
                if (String(users[i]._id) === String(response[j]._id)) {
                  users.splice(i, 1);
                  i -= 1;
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
    const { navigation, loggedUser } = this.props;
    const { admins } = this.state;

    const playlistId = navigation.getParam('playlistId');
    getUsersByPlaylistId(playlistId)
      .then((response) => {
        if (admins) {
          for (let i = 0; i < admins.length; i += 1) {
            for (let j = 0; j < response.length; j += 1) {
              if (String(admins[i]._id) === String(response[j]._id)) {
                response.splice(j, 1);
                j -= 1;
              }
            }
          }
        }
        let isUser = false;
        for (let i = 0; i < response.length; i += 1) {
          if (String(response[i]._id) === String(loggedUser._id)) {
            isUser = true;
          }
        }
        this.setState({ users: response, isUser });
        resolve();
      })
      .catch((error) => {
        console.error(`${error} in updateUsers`);
        reject();
      });
  });

  updateBans = () => new Promise((resolve, reject) => {
    const { navigation } = this.props;
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
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };

  toggleExpandedSpec = () => {
    const { collapsedSpec } = this.state;
    this.setState({ collapsedSpec: !collapsedSpec });
  };

  toggleExpandedTags = () => {
    const { collapsedTags } = this.state;
    this.setState({ collapsedTags: !collapsedTags });
  };

  toggleExpandedAddFriendToPlaylist = () => {
    const { collapsedAddFriendToPlaylist } = this.state;
    this.setState({ collapsedAddFriendToPlaylist: !collapsedAddFriendToPlaylist });
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
          .then(() => {
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
          .then(() => {
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
    const { tags } = this.state;
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    tags[tag] = !tags[tag];
    setTags(playlistId, tags)
      .then((data) => {
        this.setState({ tags: data });
      })
      .catch((error) => {
        console.error(`${error} in tagsChanged`);
      });
  };

  radioIsPressed = (value) => {
    const { navigation } = this.props;
    const playlistId = navigation.getParam('playlistId');
    let newEditRestriction = '';
    if (value === 0) {
      newEditRestriction = 'ALL';
    } else if (value === 1) {
      newEditRestriction = 'USER_RESTRICTED';
    } else if (value === 2) {
      newEditRestriction = 'ADMIN_RESTRICTED';
    } else if (value === 3) {
      newEditRestriction = 'EVENT_RESTRICTED';
    }
    setEditRestriction(playlistId, newEditRestriction)
      .then(() => {
        this.setState({ radioValue: value });
      })
      .catch((error) => {
        console.error(`${error} in radioIsPressed`);
      });
  };

  onDeletePlaylistTouchable = () => {
    const { deletePlaylistState } = this.state;
    const { navigation, loggedUser } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const roomType = navigation.getParam('roomType');

    if (deletePlaylistState === 'Supprimer la Playlist') {
      this.setState({ deletePlaylistState: 'Vous êtes certain.e ?' });
    } else if (deletePlaylistState === 'Vous êtes certain.e ?') {
      this.setState({ deletePlaylistState: 'Dernière chance !' });
    } else if (deletePlaylistState === 'Dernière chance !') {
      deletePlaylistByAdmin(playlistId, loggedUser._id)
        .then(() => {
          if (roomType === 'party') {
            NavigationUtils.resetStack(this, 'PartysList', null);
          } else if (roomType === 'radio') {
            NavigationUtils.resetStack(this, 'RadiosList', null);
          }
        })
        .catch((error) => {
          console.error(`${error} in onDeletePlaylistTouchable`);
        });
    }
  };

  render() {
    const {
      users, admins, bans, switchValue, loading, privateId, delegatedPlayerAdmin,
      collapsed, collapsedSpec, collapsedTags, collapsedAddFriendToPlaylist,
      startDate, endDate, datePickerModalVisible, tags, radioValue, deletePlaylistState,
      isUser, friends,
    } = this.state;
    let radioProps = [];
    const { navigation, loggedUser, userChanged } = this.props;
    const isAdmin = navigation.getParam('isAdmin');
    const playlistId = navigation.getParam('playlistId');
    const authorId = navigation.getParam('authorId');
    const roomType = navigation.getParam('roomType');
    let editRestrictionString = '';
    let adminOptions = (null);
    let userOptions = (null);
    let notAdminOptions = (null);
    let collapsibleIcon = (null);
    let collapsibleIconSpec = (null);
    let collapsibleIconTags = (null);
    let collapsibleIconAddFriendToPlaylist = (null);
    let specificRoomSettings = (null);
    if (isAdmin) {
      if (collapsed) {
        collapsibleIcon = (<Icon name="ios-arrow-up" style={{ marginRight: 5 }} />);
      } else {
        collapsibleIcon = (<Icon name="ios-arrow-down" style={{ marginRight: 5 }} />);
      }
      if (collapsedSpec) {
        collapsibleIconSpec = (<Icon name="ios-arrow-up" style={{ marginRight: 5 }} />);
      } else {
        collapsibleIconSpec = (<Icon name="ios-arrow-down" style={{ marginRight: 5 }} />);
      }
      if (collapsedTags) {
        collapsibleIconTags = (<Icon name="ios-arrow-up" style={{ marginRight: 5 }} />);
      } else {
        collapsibleIconTags = (<Icon name="ios-arrow-down" style={{ marginRight: 5 }} />);
      }
      if (collapsedAddFriendToPlaylist) {
        collapsibleIconAddFriendToPlaylist = (<Icon name="ios-arrow-up" style={{ marginRight: 5 }} />);
      } else {
        collapsibleIconAddFriendToPlaylist = (<Icon name="ios-arrow-down" style={{ marginRight: 5 }} />);
      }
      if (roomType === 'party') {
        radioProps = [
          { label: 'Tout le monde', value: 0 },
          { label: 'Utilisateur + Admin.', value: 1 },
          { label: 'Admin.', value: 2 },
          { label: 'Localisation et Date', value: 3 },
        ];
        editRestrictionString = 'Restriction des droits de vote :';
        specificRoomSettings = (
          <View>
            <DatePickerModal
              setModalVisible={this.setDatePickerModalVisible}
              DateModalVisible={datePickerModalVisible}
              onDateChanged={this.onDateChanged}
            />
            <TouchableOpacity onPress={this.toggleExpandedSpec}>
              <View style={styles.header}>
                <Text style={styles.header}>
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
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ flex: 6 }}>
                  <Text>
                    Date de début :
                  </Text>
                  <Text>
                    {String(startDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setDatePickerModalVisible('start');
                  }}
                  style={styles.customizedTouchable}
                >
                  <Text>
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ flex: 6 }}>
                  <Text>
                    Date de fin :
                  </Text>
                  <Text>
                    {String(startDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setDatePickerModalVisible('end');
                  }}
                  style={styles.customizedTouchable}
                >
                  <Text>
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
            </Collapsible>
          </View>
        );
      } else {
        radioProps = [
          { label: 'Tout le monde', value: 0 },
          { label: 'Utilisateur + Admin.', value: 1 },
          { label: 'Admin.', value: 2 },
        ];
        editRestrictionString = "Restriction des droits d'édition :";
        specificRoomSettings = (
          null
        );
      }
      adminOptions = (
        <View>
          <Text style={styles.subText}>
            Les paramètres sont rafraîchis à chaque modification,
            {' '}
            et peuvent être modifiés en même temps
            {' '}
            par d&apos;autres utilisateurs ou administrateurs.
          </Text>
          <View style={[styles.subContainer, { justifyContent: 'space-between' }]}>
            <Text style={styles.subContainerFontStyle}>
              Publique
            </Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
          </View>
          <View>
            <Text>
              {editRestrictionString}
            </Text>
            <RadioForm
              ref={(r) => { this.radioForm = r; }}
              radio_props={radioProps}
              initial={radioValue}
              animation={false}
              onPress={(value) => {
                this.radioIsPressed(value);
              }}
            />
          </View>
          {specificRoomSettings}
          <TouchableOpacity onPress={this.toggleExpandedTags}>
            <View style={styles.header}>
              <Text style={styles.header}>
                Tags
              </Text>
              {collapsibleIconTags}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsedTags} align="center">
            <View style={styles.checkboxesWrapper}>
              <View style={styles.checkboxRow}>
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
              <View style={styles.checkboxRow}>
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
              <View style={styles.checkboxRow}>
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
          <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
              <Text style={styles.header}>
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
              <Text> Délégué au Contrôle du Player</Text>
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
          <Text style={[styles.subContainerFontStyle, { textAlign: 'center' }]}>
            Droits Administrateurs
          </Text>
          <View
            style={{
              borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
            }}
          >
            <AdminListInSettings
              loggedUser={loggedUser}
              displayLoader={this.displayLoader}
              admins={admins}
              onRefresh={this._onRefresh}
              authorId={authorId}
              playlistId={playlistId}
              isLoading={this.isLoading}
              roomType={roomType}
              parent={this}
              delegatedPlayerAdmin={delegatedPlayerAdmin}
              navigation={navigation}
            />
          </View>
          <Text style={[styles.subContainerFontStyle, { textAlign: 'center' }]}>
            Utilisateurs
          </Text>
          <View
            style={{
              borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
            }}
          >
            <UserListInSettings
              loggedUser={loggedUser}
              displayLoader={this.displayLoader}
              users={users}
              onRefresh={this._onRefresh}
              playlistId={playlistId}
              isLoading={this.isLoading}
              roomType={roomType}
              parent={this}
              isAdmin={isAdmin}
              userChanged={userChanged}
              navigation={navigation}
            />
          </View>
          <Text style={[styles.subContainerFontStyle, { textAlign: 'center' }]}>
            Bannis
          </Text>
          <View
            style={{
              borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
            }}
          >
            <BansListInSettings
              displayLoader={this.displayLoader}
              bans={bans}
              onRefresh={this._onRefresh}
              playlistId={playlistId}
              isLoading={this.isLoading}
              navigation={navigation}
            />
          </View>
          <TouchableOpacity onPress={this.toggleExpandedAddFriendToPlaylist}>
            <View style={styles.header}>
              <Text style={styles.header}>
                Ajouter un ami à la playlist
              </Text>
              {collapsibleIconAddFriendToPlaylist}
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={collapsedAddFriendToPlaylist} align="center">
            <View
              style={{
                borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
              }}
            >
              <FriendsInSettings
                friends={friends}
                users={users}
                admins={admins}
                onRefresh={this._onRefresh}
                playlistId={playlistId}
                displayLoader={this.displayLoader}
                isLoading={this.isLoading}
                navigation={navigation}
              />
            </View>
          </Collapsible>
          <View style={[styles.subContainer, { justifyContent: 'center' }]}>
            <Button
              title="Quitter la playlist"
              onPress={() => {
                this.leavingPlaylist();
              }}
              style={styles.leavingButton}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={this.onDeletePlaylistTouchable}
              style={styles.deletePlaylistTouchable}
            >
              <Text style={{ fontSize: 20 }}>
                {deletePlaylistState}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      if (roomType === 'party' && !isAdmin) {
        notAdminOptions = (
          <View>
            <View>
              <Text>
                La playlist est
                {' '}
                {switchValue ? 'publique.' : 'privée.'}
              </Text>
            </View>
            <View>
              <Text>
                Localisation : (?)
              </Text>
            </View>
            <Text>
              Date de début de l&apos;évènement :
            </Text>
            <Text>
              {String(startDate)}
            </Text>
            <Text>
              Date de fin de l&apos;évènement :
            </Text>
            <Text>
              {String(endDate)}
            </Text>
          </View>
        );
      } else if (roomType === 'radio' && !isAdmin) {
        notAdminOptions = (
          <View>
            <View>
              <Text>
                La playlist est
                {' '}
                {switchValue ? 'publique.' : 'privée.'}
              </Text>
            </View>
          </View>
        );
      }
      if (isUser) {
        userOptions = (
          <View>
            <View style={[styles.subContainer, { justifyContent: 'space-between' }]}>
              <Text
                selectable
                style={styles.subContainerFontStyle}
              >
                Code privé :
                {' '}
                {privateId}
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
            <Text style={[styles.subContainerFontStyle, { textAlign: 'center' }]}>
              Utilisateurs
            </Text>
            <View
              style={{
                borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
              }}
            >
              <UserListInSettings
                loggedUser={loggedUser}
                displayLoader={this.displayLoader}
                users={users}
                onRefresh={this._onRefresh}
                playlistId={playlistId}
                isLoading={this.isLoading}
                roomType={roomType}
                parent={this}
                isAdmin={isAdmin}
                userChanged={userChanged}
              />
            </View>
            <TouchableOpacity onPress={this.toggleExpandedAddFriendToPlaylist}>
              <View style={styles.header}>
                <Text style={styles.header}>
                  Ajouter un ami à la playlist
                </Text>
                {collapsibleIconAddFriendToPlaylist}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedAddFriendToPlaylist} align="center">
              <View
                style={{
                  borderTopWidth: 1, borderColor: '#969696', borderBottomWidth: 1, margin: 10, minHeight: 20,
                }}
              >
                <FriendsInSettings
                  friends={friends}
                  users={users}
                  admins={admins}
                  onRefresh={this._onRefresh}
                  playlistId={playlistId}
                  displayLoader={this.displayLoader}
                  isLoading={this.isLoading}
                  navigation={navigation}
                />
              </View>
            </Collapsible>
            <View style={[styles.subContainer, { justifyContent: 'center' }]}>
              <Button
                title="Quitter la playlist"
                onPress={() => {
                  this.leavingPlaylist();
                }}
                style={styles.leavingButton}
              />
            </View>
          </View>
        );
      }
    }
    const rendering = (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Paramètres de la playlist
        </Text>
        {userOptions}
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
    padding: 5,
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
  deletePlaylistTouchable: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
    flex: 1,
    alignItems: 'center',
    height: 40,
    backgroundColor: '#CCCCCC',
    borderRadius: 20,
    overflow: 'hidden',
  },
  elementListTitle: {
    // backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customizedTouchable: {
    flex: 1,
    alignItems: 'center',
    minWidth: 20,
    backgroundColor: '#F5FCFF',
    padding: 5,
    margin: 5,
    height: 30,
    borderRadius: 20,
  },
});

export default PlaylistSettings;

import {
  View, StyleSheet, Text, Switch, TouchableOpacity, ScrollView, Clipboard, Alert,
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
  setEditRestriction, deletePlaylistByAdmin, getFriends, getPlaylistLocation, setPlaylistLocation,
} from '../../API/BackApi';
import NavigationUtils from '../navigation/NavigationUtils';
import DatePickerModal from '../components/Playlists/DatePickerModal';
import FriendsInSettings from '../components/Playlist/FriendsInSettings';
import {
  Typography, Colors, Buttons,
} from '../styles';


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
      collapsedFriends: true,
      collapsedUsers: true,
      collapsedAdmins: true,
      collapsedBans: true,
      datePickerModalVisible: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000),
      initialDate: new Date(),
      dateType: 0,
      location: {},
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
            this.getLocation(playlistId);
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
        if (this.radioForm) {
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

  getLocation = (playlistId) => {
    const { navigation } = this.props;
    const roomType = navigation.getParam('roomType');
    if (roomType === 'party') {
      getPlaylistLocation(playlistId)
        .then((location) => {
          this.setState({ location });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  setLocation = () => {
    const { navigation, loggedUser, socket } = this.props;
    const roomType = navigation.getParam('roomType');
    const playlistId = navigation.getParam('playlistId');
    if (roomType === 'party') {
      // eslint-disable-next-line no-undef
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setPlaylistLocation(playlistId, location, loggedUser._id)
            .then((newLoc) => {
              socket.emit('parameterChanged', playlistId);
              this.setState({ location: newLoc });
            })
            .catch((error) => {
              console.error(error);
            });
        },
        error => Alert.alert(
          `${error.message}\n Position introuvable.`,
        ),
        { enableHighAccuracy: false, timeout: 10000 },
      );
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
            this.getLocation(playlistId);
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
    const { collapsedFriends } = this.state;
    this.setState({ collapsedFriends: !collapsedFriends });
  };

  toggleExpandedUsers = () => {
    const { collapsedUsers } = this.state;
    this.setState({ collapsedUsers: !collapsedUsers });
  };

  toggleExpandedAdmins = () => {
    const { collapsedAdmins } = this.state;
    this.setState({ collapsedAdmins: !collapsedAdmins });
  };

  toggleExpandedBans = () => {
    const { collapsedBans } = this.state;
    this.setState({ collapsedBans: !collapsedBans });
  };

  setDatePickerModalVisible = (dateType) => {
    const { datePickerModalVisible, startDate, endDate } = this.state;
    const visible = !datePickerModalVisible;
    if (dateType !== undefined) {
      if (dateType === 'start') {
        this.setState({ dateType, datePickerModalVisible: visible, initialDate: startDate });
      } else if (dateType === 'end') {
        this.setState({ dateType, datePickerModalVisible: visible, initialDate: endDate });
      }
    } else {
      this.setState({ datePickerModalVisible: visible });
    }
  };

  onDateChanged = (changedDate) => {
    const { navigation, socket } = this.props;
    const playlistId = navigation.getParam('playlistId');
    const { dateType, startDate, endDate } = this.state;
    if (dateType === 'start') {
      if (changedDate < endDate) {
        setStartDate(playlistId, changedDate)
          .then(() => {
            this.setState({ startDate: changedDate });
            socket.emit('parameterChanged', playlistId);
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
            socket.emit('parameterChanged', playlistId);
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

  radioIsPressed = (val) => {
    const { navigation, socket } = this.props;
    const playlistId = navigation.getParam('playlistId');
    let value = 0;
    let newEditRestriction = '';
    if (val.value !== undefined) {
      ({ value } = val);
    } else {
      value = val;
    }
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
        socket.emit('parameterChanged', playlistId);
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
      collapsed, collapsedSpec, collapsedTags, collapsedFriends, collapsedUsers,
      collapsedAdmins, collapsedBans, startDate, endDate, initialDate, datePickerModalVisible,
      tags, radioValue, deletePlaylistState, isUser, friends, location,
    } = this.state;
    const loc = location;
    if (Object.keys(location).length === 0) {
      loc.coords = {};
      loc.coords.latitude = 'Indéfinie';
      loc.coords.longitude = 'Indéfinie';
    }
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
    let collapsibleIconFriends = (null);
    let collapsibleIconUsers = (null);
    let collapsibleIconAdmins = (null);
    let collapsibleIconBans = (null);
    let specificRoomSettings = (null);
    if (collapsedFriends) {
      collapsibleIconFriends = (<Icon name="ios-arrow-up" style={styles.icon} />);
    } else {
      collapsibleIconFriends = (<Icon name="ios-arrow-down" style={styles.icon} />);
    }
    if (collapsedUsers) {
      collapsibleIconUsers = (<Icon name="ios-arrow-up" style={styles.icon} />);
    } else {
      collapsibleIconUsers = (<Icon name="ios-arrow-down" style={styles.icon} />);
    }
    if (isAdmin) {
      if (collapsed) {
        collapsibleIcon = (<Icon name="ios-arrow-up" style={styles.icon} />);
      } else {
        collapsibleIcon = (<Icon name="ios-arrow-down" style={styles.icon} />);
      }
      if (collapsedSpec) {
        collapsibleIconSpec = (<Icon name="ios-arrow-up" style={styles.icon} />);
      } else {
        collapsibleIconSpec = (<Icon name="ios-arrow-down" style={styles.icon} />);
      }
      if (collapsedTags) {
        collapsibleIconTags = (<Icon name="ios-arrow-up" style={styles.icon} />);
      } else {
        collapsibleIconTags = (<Icon name="ios-arrow-down" style={styles.icon} />);
      }
      if (collapsedAdmins) {
        collapsibleIconAdmins = (<Icon name="ios-arrow-up" style={styles.icon} />);
      } else {
        collapsibleIconAdmins = (<Icon name="ios-arrow-down" style={styles.icon} />);
      }
      if (collapsedBans) {
        collapsibleIconBans = (<Icon name="ios-arrow-up" style={styles.icon} />);
      } else {
        collapsibleIconBans = (<Icon name="ios-arrow-down" style={styles.icon} />);
      }
      if (roomType === 'party') {
        radioProps = [
          { label: 'Tout le monde', value: 0 },
          { label: 'Utilisateur + Admin.', value: 1 },
          { label: 'Admin.', value: 2 },
          { label: 'Localisation et Date', value: 3 },
        ];
        editRestrictionString = 'Droits de vote :';
        specificRoomSettings = (
          <View>
            <DatePickerModal
              setModalVisible={this.setDatePickerModalVisible}
              DateModalVisible={datePickerModalVisible}
              onDateChanged={this.onDateChanged}
              initialDate={initialDate}
            />
            <View style={styles.section}>
              <TouchableOpacity onPress={this.toggleExpandedSpec}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                  <Text style={styles.sectionHeaderText}>
                    Option de Party
                  </Text>
                  {collapsibleIconSpec}
                </View>
              </TouchableOpacity>
              <View style={styles.sectionContent}>
                <Collapsible collapsed={collapsedSpec}>
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>
                        Localisation
                      </Text>
                    </View>
                    <View style={styles.sectionContentCenterAligned}>
                      <Text style={styles.bodyText}>
                        {`Latitude : ${loc.coords.latitude}`}
                      </Text>
                      <Text style={styles.bodyText}>
                        {`Longitude : ${loc.coords.longitude}`}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.setLocation();
                        }}
                        style={Buttons.largeButton}
                      >
                        <Text style={Buttons.text}>
                          Définir sur ma position
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={Typography.sectionSeparator} />
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>
                        Début de l&apos;événement
                      </Text>
                    </View>
                    <View style={styles.sectionContentCenterAligned}>
                      <Text style={styles.bodyText}>
                        {String(startDate)}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.setDatePickerModalVisible('start');
                        }}
                        style={Buttons.largeButton}
                      >
                        <Text style={Buttons.text}>
                          Modifier
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={Typography.sectionSeparator} />
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>
                        Fin de l&apos;événement
                      </Text>
                    </View>
                    <View style={styles.sectionContentCenterAligned}>
                      <Text style={styles.bodyText}>
                        {String(endDate)}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this.setDatePickerModalVisible('end');
                        }}
                        style={Buttons.largeButton}
                      >
                        <Text style={Buttons.text}>
                          Modifier
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Collapsible>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
          </View>
        );
      } else {
        radioProps = [
          { label: 'Tout le monde', value: 0 },
          { label: 'Utilisateur + Admin.', value: 1 },
          { label: 'Admin.', value: 2 },
        ];
        editRestrictionString = "Droits d'édition :";
        specificRoomSettings = (
          null
        );
      }
      adminOptions = (
        <View>
          <Text style={styles.bodyText}>
            Les paramètres sont rafraîchis à chaque modification,
            {' '}
            et peuvent être modifiés en même temps
            {' '}
            par d&apos;autres utilisateurs ou administrateurs.
          </Text>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Code privé
              </Text>
            </View>
            <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
              <Text
                selectable
                style={styles.bodyText}
              >
                {privateId}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(String(privateId));
                  SimpleToast.show('Code copié dans le Presse-Papier.');
                }}
              >
                <Icon name="ios-clipboard" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Visibilité
              </Text>
            </View>
            <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
              <Text style={styles.bodyText}>
                Publique
              </Text>
              <Switch
                style={styles.switch}
                onValueChange={this.toggleSwitch}
                value={switchValue}
                thumbColor={Colors.button}
              />
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                {editRestrictionString}
              </Text>
            </View>
            <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
              <RadioForm
                ref={(r) => { this.radioForm = r; }}
                radio_props={radioProps}
                initial={radioValue}
                animation={false}
                buttonColor={Colors.button}
                selectedButtonColor={Colors.buttonSelected}
                selectedLabelColor={Colors.baseText}
                labelColor={Colors.baseText}
                onPress={(value) => {
                  this.radioIsPressed(value);
                }}
              />
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          {specificRoomSettings}
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpandedTags}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Tags
                </Text>
                {collapsibleIconTags}
              </View>
            </TouchableOpacity>
            <View style={styles.sectionContent}>
              <Collapsible collapsed={collapsedTags} align="center">
                <View style={styles.checkboxesWrapper}>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={tags.Rock}
                      tagsChanged={this.tagsChanged}
                      tag="Rock"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Rap}
                      tagsChanged={this.tagsChanged}
                      tag="Rap"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Classic}
                      tagsChanged={this.tagsChanged}
                      tag="Classic"
                      textStyle={styles.bodyText}
                    />
                  </View>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={tags.Electro}
                      tagsChanged={this.tagsChanged}
                      tag="Electro"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Reggae}
                      tagsChanged={this.tagsChanged}
                      tag="Reggae"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Metal}
                      tagsChanged={this.tagsChanged}
                      tag="Metal"
                      textStyle={styles.bodyText}
                    />
                  </View>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={tags.Pop}
                      tagsChanged={this.tagsChanged}
                      tag="Pop"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Dub}
                      tagsChanged={this.tagsChanged}
                      tag="Dub"
                      textStyle={styles.bodyText}
                    />
                    <SettingsTagCheckbox
                      checked={tags.Country}
                      tagsChanged={this.tagsChanged}
                      tag="Country"
                      textStyle={styles.bodyText}
                    />
                  </View>
                </View>
              </Collapsible>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpanded}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Légende
                </Text>
                {collapsibleIcon}
              </View>
            </TouchableOpacity>
            <View style={styles.sectionContent}>
              <Collapsible collapsed={collapsed} align="center">
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="md-school" style={styles.icon} />
                  <Text style={styles.bodyText}> Auteur </Text>
                </View>
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="musical-notes" style={styles.icon} />
                  <Text style={styles.bodyText}> Délégué au Contrôle du Player</Text>
                </View>
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="arrow-down" style={styles.icon} />
                  <Text style={styles.bodyText}> Admin. vers Utilisateur </Text>
                </View>
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="arrow-up" style={styles.icon} />
                  <Text style={styles.bodyText}> Promotion Utilisateur vers Admin. | Unban</Text>
                </View>
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="md-walk" style={styles.icon} />
                  <Text style={styles.bodyText}> Kick </Text>
                </View>
                <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                  <Icon name="md-trash" style={styles.icon} />
                  <Text style={styles.bodyText}> Bannissement </Text>
                </View>
              </Collapsible>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpandedAdmins}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Droits Administrateurs
                </Text>
                {collapsibleIconAdmins}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedAdmins} align="center">
              <View style={styles.sectionContent}>
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
            </Collapsible>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpandedUsers}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Utilisateurs
                </Text>
                {collapsibleIconUsers}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedUsers} align="center">
              <View style={styles.sectionContent}>
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
            </Collapsible>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpandedBans}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Bannis
                </Text>
                {collapsibleIconBans}
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsedBans} align="center">
              <View style={styles.sectionContent}>
                <BansListInSettings
                  displayLoader={this.displayLoader}
                  bans={bans}
                  onRefresh={this._onRefresh}
                  playlistId={playlistId}
                  isLoading={this.isLoading}
                  navigation={navigation}
                />
              </View>
            </Collapsible>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <TouchableOpacity onPress={this.toggleExpandedAddFriendToPlaylist}>
              <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.sectionHeaderText}>
                  Ajouter un ami à la playlist
                </Text>
                {collapsibleIconFriends}
              </View>
            </TouchableOpacity>
            <View style={styles.sectionContent}>
              <Collapsible collapsed={collapsedFriends} align="center">
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
              </Collapsible>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionContentCenterAligned}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.leavingPlaylist();
                }}
                style={Buttons.largeButton}
              >
                <Text style={Buttons.text}>
                  Quitter la playlist
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionContentCenterAligned}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.onDeletePlaylistTouchable}
                style={Buttons.largeButton}
              >
                <Text style={Buttons.text}>
                  {deletePlaylistState}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      if (roomType === 'party' && !isAdmin) {
        notAdminOptions = (
          <View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Visibilité
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  La playlist est
                  {' '}
                  {switchValue ? 'publique.' : 'privée.'}
                </Text>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Localisation
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  {`Latitude : ${loc.coords.latitude}`}
                </Text>
                <Text style={styles.bodyText}>
                  {`Longitude : ${loc.coords.longitude}`}
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Début de l&apos;évènement
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  {String(startDate)}
                </Text>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Fin de l&apos;évènement
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  {String(endDate)}
                </Text>
              </View>
            </View>
          </View>
        );
      } else if (roomType === 'radio' && !isAdmin) {
        notAdminOptions = (
          <View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Visibilité
                </Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.bodyText}>
                  La playlist est
                  {' '}
                  {switchValue ? 'publique.' : 'privée.'}
                </Text>
              </View>
            </View>
          </View>
        );
      }
      if (isUser) {
        userOptions = (
          <View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Code privé
                </Text>
              </View>
              <View style={[styles.sectionContentRow, { justifyContent: 'space-between' }]}>
                <Text
                  selectable
                  style={styles.bodyText}
                >
                  {privateId}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(String(privateId));
                    SimpleToast.show('Code copié dans le Presse-Papier.');
                  }}
                >
                  <Icon name="ios-clipboard" style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <TouchableOpacity onPress={this.toggleExpandedUsers}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                  <Text style={styles.sectionHeaderText}>
                    Utilisateurs
                  </Text>
                  {collapsibleIconUsers}
                </View>
              </TouchableOpacity>
              <Collapsible collapsed={collapsedBans} align="center">
                <View style={styles.sectionContent}>
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
              </Collapsible>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <TouchableOpacity onPress={this.toggleExpandedAddFriendToPlaylist}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between' }]}>
                  <Text style={styles.sectionHeaderText}>
                    Ajouter un ami à la playlist
                  </Text>
                  {collapsibleIconFriends}
                </View>
              </TouchableOpacity>
              <View style={styles.sectionContent}>
                <Collapsible collapsed={collapsedFriends} align="center">
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
                </Collapsible>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <View style={styles.sectionContent}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this.leavingPlaylist();
                  }}
                  style={Buttons.largeButton}
                >
                  <Text style={Buttons.text}>
                    Quitter la playlist
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }
    }
    const rendering = (
      <View style={styles.mainContainer}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenHeaderText}>
            Paramètres de la playlist
          </Text>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {userOptions}
            {notAdminOptions}
            {adminOptions}
            <Loader loading={loading} />
          </ScrollView>
        </View>
      </View>
    );
    return (rendering);
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenHeader: {
    ...Typography.screenHeader,
  },
  screenHeaderText: {
    ...Typography.screenHeaderText,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
  },
  sectionHeaderText: {
    ...Typography.sectionHeaderText,
  },
  body: {
    ...Typography.body,
  },
  bodyText: {
    ...Typography.bodyText,
  },
  section: {
    ...Typography.section,
  },
  sectionContent: {
    ...Typography.sectionContent,
  },
  sectionContentCenterAligned: {
    ...Typography.sectionContent,
    alignItems: 'center',
  },
  sectionContentRow: {
    ...Typography.sectionContent,
    flexDirection: 'row',
  },
  icon: {
    ...Typography.icon,
  },
  switch: {
    marginRight: 10,
  },
  checkboxRow: {
    ...Typography.checkboxRow,
  },
  checkboxesWrapper: {
    ...Typography.checkboxesWrapper,
  },
});

export default PlaylistSettings;

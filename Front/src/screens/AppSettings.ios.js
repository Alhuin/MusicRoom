import React from 'react';
import {
  StyleSheet, View, SafeAreaView, Text, TextInput, Alert, TouchableOpacity, ScrollView, FlatList,
  Linking, BackHandler,
} from 'react-native';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
import {
  updateUser, deleteFriend, getFriends, updateUserPremium,
} from '../../API/BackApi';
import SettingsTagCheckbox from '../components/Playlist/SettingsTagCheckbox';
import { getDeezerToken } from '../../API/DeezerApi';
import {
  Colors, Typography, Cards, Buttons,
} from '../styles';

class AppSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.loggedUser,
      email: props.loggedUser.email,
      login: props.loggedUser.login,
      name: props.loggedUser.name,
      familyName: props.loggedUser.familyName,
      phoneNumber: props.loggedUser.phoneNumber,
      preferences: props.loggedUser.preferences,
      visibilityTable: props.loggedUser.visibilityTable,
      premium: props.loggedUser.premium,
      collapsed: true,
      friends: [],
      DeezerToken: '',
    };
  }

  componentDidMount(): void {
    const { user } = this.state;
    const { navigation } = this.props;
    getFriends(user._id)
      .then((friends) => {
        this.setState({ friends });
      })
      .catch((error) => {
        console.error(error);
      });
    this._focusListener = navigation.addListener('didFocus', () => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    });
    this._blurListener = navigation.addListener('willBlur', () => {
      this.backHandler.remove();
    });
  }

  updateLogin = (text) => {
    this.setState({ login: text });
  };

  updateName = (text) => {
    this.setState({ name: text });
  };

  updateFamilyName = (text) => {
    this.setState({ familyName: text });
  };

  updateEmail = (text) => {
    this.setState({ email: text });
  };

  updatePhoneNumber = (text) => {
    this.setState({ phoneNumber: text });
  };

  onPreferenceChanged = (tag) => {
    const { preferences } = this.state;
    preferences[tag] = !preferences[tag];
    this.setState({ preferences });
  };

  onVisibilityChanged = (key) => {
    const { visibilityTable } = this.state;
    if (visibilityTable[key] === 'ALL') {
      visibilityTable[key] = 'FRIEND_ONLY';
    } else if (visibilityTable[key] === 'FRIEND_ONLY') {
      visibilityTable[key] = 'PRIVATE';
    } else if (visibilityTable[key] === 'PRIVATE') {
      visibilityTable[key] = 'ALL';
    }
    this.setState({ visibilityTable });
  };

  _onPressModify = () => {
    const { userChanged } = this.props;
    const {
      user, login, name, familyName, email, phoneNumber, preferences, visibilityTable,
    } = this.state;
    if (!(name.length && familyName.length && email.length
        && login.length && phoneNumber.length)) {
      Alert.alert('Erreur : entrée vide');
      console.log('Erreur : entrée vide');
    } else {
      updateUser(user._id, login, name, familyName, email, phoneNumber, preferences,
        visibilityTable, '', '')
        .then((newUser) => {
          userChanged(newUser);
          Alert.alert('Les paramètres ont bien été modifiés');
        })
        .catch(error => console.log(error));
    }
  };

  _onPressPremium = () => {
    const { user, premium } = this.state;
    const { userChanged } = this.props;

    updateUserPremium(user._id, !premium)
      .then((newUser) => {
        userChanged(newUser);
        if (newUser.premium) {
          Alert.alert('Vous avez désormais accès à l\'offre Premium !');
        } else {
          Alert.alert('Vous avez désormais seulement accès à l\'offre Freemium !');
        }
        this.setState({ user: newUser, premium: newUser.premium });
      })
      .catch(error => console.log(error));
  };

  toggleExpanded = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };

  getDeez = () => {
    Linking.openURL('https://connect.deezer.com/oauth/auth.php?app_id=385364&redirect_uri=http://10.3.1.1:3000/api/users/deezer')
      .catch(err => console.error("Couldn't load page", err));
  };

  render() {
    const { navigation } = this.props;
    const { DeezerToken } = this.state;
    const DeezerCode = navigation.getParam('DeezCode');
    const {
      user, preferences, visibilityTable, collapsed, friends,
      login, name, familyName, email, phoneNumber, premium,
    } = this.state;
    const iconFromVisibilityTable = {};
    if (DeezerCode !== undefined && DeezerToken === '') {
      getDeezerToken(DeezerCode)
        .then((response) => {
          this.setState({ DeezerToken: response.firstname });
          updateUser(user._id, login, name, familyName, email, phoneNumber, preferences,
            visibilityTable, response.id.toString(), '')
            .then(res => console.log(res))
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }
    Object.assign(iconFromVisibilityTable, visibilityTable);
    Object.keys(iconFromVisibilityTable).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(iconFromVisibilityTable, key)) {
        if (iconFromVisibilityTable[key] === 'ALL') {
          iconFromVisibilityTable[key] = 'ios-people';
        } else if (iconFromVisibilityTable[key] === 'PRIVATE') {
          iconFromVisibilityTable[key] = 'ios-eye-off';
        } else if (iconFromVisibilityTable[key] === 'FRIEND_ONLY') {
          iconFromVisibilityTable[key] = 'ios-person';
        }
      }
    });
    let collapsibleIcon;
    if (collapsed) {
      collapsibleIcon = (<Icon name="ios-arrow-up" style={styles.icon} />);
    } else {
      collapsibleIcon = (<Icon name="ios-arrow-down" style={styles.icon} />);
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.screenHeader }}>
        <View style={styles.main_container}>
          <View style={Typography.screenHeader}>
            <Text style={Typography.screenHeaderText}>
              Paramètres & Préférences
            </Text>
          </View>
          <ScrollView>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Identifiant</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateLogin}
                  autoCapitalize="none"
                >
                  {user.login}
                </TextInput>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Nom</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateName}
                  autoCapitalize="none"
                >
                  {user.name}
                </TextInput>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Nom de famille</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateFamilyName}
                  autoCapitalize="none"
                >
                  {user.familyName}
                </TextInput>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => {
                    this.onVisibilityChanged('familyName');
                  }}
                >
                  <Icon
                    name={iconFromVisibilityTable.familyName}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Email</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateEmail}
                  autoCapitalize="none"
                >
                  {user.email}
                </TextInput>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => {
                    this.onVisibilityChanged('email');
                  }}
                >
                  <Icon
                    name={iconFromVisibilityTable.email}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Téléphone</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updatePhoneNumber}
                  autoCapitalize="none"
                >
                  {user.phoneNumber}
                </TextInput>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => {
                    this.onVisibilityChanged('phoneNumber');
                  }}
                >
                  <Icon
                    name={iconFromVisibilityTable.phoneNumber}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Préférences :</Text>
              </View>
              <View style={[styles.cardContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={styles.checkboxesWrapper}>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={preferences.Rock}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Rock"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Rap}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Rap"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Classic}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Classic"
                      textStyle={{ color: 'white' }}
                    />
                  </View>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={preferences.Electro}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Electro"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Reggae}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Reggae"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Metal}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Metal"
                      textStyle={{ color: 'white' }}
                    />
                  </View>
                  <View style={styles.checkboxRow}>
                    <SettingsTagCheckbox
                      checked={preferences.Pop}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Pop"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Dub}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Dub"
                      textStyle={{ color: 'white' }}
                    />
                    <SettingsTagCheckbox
                      checked={preferences.Country}
                      tagsChanged={this.onPreferenceChanged}
                      tag="Country"
                      textStyle={{ color: 'white' }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={() => {
                    this.onVisibilityChanged('preferences');
                  }}
                >
                  <Icon
                    name={iconFromVisibilityTable.preferences}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <View style={[styles.sectionContent, { alignItems: 'center' }]}>
                <TouchableOpacity
                  onPress={this._onPressModify}
                  style={Buttons.largeButton}
                >
                  <Text style={Buttons.text}>
                    Confirmer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <TouchableOpacity onPress={this.toggleExpanded}>
                <View style={[styles.sectionHeader, { justifyContent: 'space-between', alignItems: 'center' }]}>
                  <Text style={styles.sectionHeaderText}>
                    Amis
                  </Text>
                  {collapsibleIcon}
                </View>
              </TouchableOpacity>
              <View style={styles.sectionContent}>
                <Collapsible collapsed={collapsed} align="center">
                  <FlatList
                    data={friends}
                    keyExtractor={item => item._id.toString()}
                    renderItem={
                        ({ item }) => {
                          const friendId = item._id;
                          const element = (
                            <View style={styles.card}>
                              <View
                                style={[
                                  styles.cardContentRow,
                                  { justifyContent: 'space-between', alignItems: 'center' },
                                ]}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate('UserProfile', { userProfileId: item._id });
                                  }}
                                  style={{ flex: 6 }}
                                >
                                  <Text style={styles.cardHeaderText}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    deleteFriend(friendId, user._id)
                                      .then(() => {
                                        getFriends(user._id)
                                          .then((newFriends) => {
                                            this.setState({ friends: newFriends });
                                          })
                                          .catch((error) => {
                                            console.error(error);
                                          });
                                      })
                                      .catch((error) => {
                                        console.error(error);
                                      });
                                  }}
                                  style={styles.iconWrapper}
                                >
                                  <Icon name="ios-remove" style={styles.icon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                          return (element);
                        }
                      }
                  />
                </Collapsible>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <View style={[styles.sectionContent, { alignItems: 'center' }]}>
                <TouchableOpacity
                  onPress={this.getDeez}
                  style={Buttons.largeButton}
                >
                  <Text style={Buttons.text}>
                    Connexion Deezer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={Typography.sectionSeparator} />
            <View style={styles.section}>
              <View style={[styles.sectionContent, { alignItems: 'center' }]}>
                <TouchableOpacity
                  onPress={this._onPressPremium}
                  style={Buttons.largeButton}
                >
                  <Text style={Buttons.text}>
                    Mode
                    { !premium ? ' Premium' : ' Freemium' }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

let styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    ...Cards.card,
  },
  cardHeader: {
    ...Cards.cardHeader,
  },
  cardHeaderText: {
    ...Cards.cardHeaderText,
  },
  cardContent: {
    ...Cards.cardContent,
  },
  cardContentRow: {
    ...Typography.sectionContent,
    flexDirection: 'row',
    width: '100%',
  },
  iconWrapper: {
    ...Typography.iconWrapper,
    flex: 1,
  },
  icon: {
    ...Typography.icon,
  },
  section: {
    ...Typography.section,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
  },
  sectionHeaderText: {
    ...Typography.sectionHeaderText,
  },
  sectionContent: {
    ...Typography.sectionContent,
  },
  inputStyle: {
    ...Typography.textInput,
    backgroundColor: 'transparent',
    flex: 6,
  },
  checkboxRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  checkboxesWrapper: {
    flexDirection: 'row',
    flex: 6,
  },
});

export default AppSettings;

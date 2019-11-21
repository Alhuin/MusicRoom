import React from 'react';
import {
  StyleSheet, View, Text, Button, TextInput, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import { Icon } from 'native-base';
import { updateUser } from '../../API/BackApi';
import SettingsTagCheckbox from '../components/Playlist/SettingsTagCheckbox';

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
      // friends: props.loggedUser.friends,
    };
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
    // console.log(visibilityTable);
    this.setState({ visibilityTable });
  };

  _onPressModify = () => {
    const { userChanged } = this.props;
    const {
      user, login, name, familyName, email, phoneNumber, preferences, visibilityTable,
    } = this.state;
    if (!(name.length && familyName.length && email.length
        && login.length && phoneNumber.length)) {
      Alert.alert('error: empty field.');
      console.log('error, empty field');
    } else {
      updateUser(user._id, login, name, familyName, email, phoneNumber, preferences, visibilityTable)
        .then((newUser) => {
          userChanged(newUser);
          Alert.alert('Les paramètres ont bien été modifiés');
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const { user, preferences, visibilityTable } = this.state;
    const iconFromVisibilityTable = {};
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
    // console.log(visibilityTable);
    return (
      <ScrollView>
        <View style={styles.main_container}>
          <Text style={styles.title_set}>
            Settings
          </Text>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Identifiant :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateLogin}
                >
                  { user.login }
                </TextInput>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateName}
                >
                  { user.name }
                </TextInput>
              </View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  this.onVisibilityChanged('name');
                }}
              >
                <Icon
                  name={iconFromVisibilityTable.name}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom de famille :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateFamilyName}
                >
                  { user.familyName }
                </TextInput>
              </View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  this.onVisibilityChanged('familyName');
                }}
              >
                <Icon
                  name={iconFromVisibilityTable.familyName}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Email :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updateEmail}
                >
                  { user.email }
                </TextInput>
              </View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  this.onVisibilityChanged('email');
                }}
              >
                <Icon
                  name={iconFromVisibilityTable.email}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Tél :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={this.updatePhoneNumber}
                >
                  { user.phoneNumber }
                </TextInput>
              </View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  this.onVisibilityChanged('phoneNumber');
                }}
              >
                <Icon
                  name={iconFromVisibilityTable.phoneNumber}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Préférences :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
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
              </View>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => {
                  this.onVisibilityChanged('preferences');
                }}
              >
                <Icon
                  name={iconFromVisibilityTable.preferences}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Button
            title="Modifier"
            onPress={this._onPressModify}
          />
        </View>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  main_container: {
    flex: 1,
    // height: 120,
  },
  card: {
    minHeight: 110,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },
  content_container: {
    flexDirection: 'row',
    margin: 5,
    flex: 2,
    justifyContent: 'space-around',
  },
  title_container: {
    flex: 1,
  },
  title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 6,
  },
  inputStyle: {
    // width: '60%',
    color: 'white',
  },
  title_set: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingRight: 5,
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
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    fontSize: 40,
    color: 'white',
  },
});

export default AppSettings;

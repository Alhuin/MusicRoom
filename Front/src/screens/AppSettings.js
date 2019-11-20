import React from 'react';
import {
  StyleSheet, View, Text, Button, TextInput, Alert,
} from 'react-native';
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

  _onPressModify = () => {
    const { userChanged } = this.props;
    const {
      user, login, name, familyName, email, phoneNumber, preferences,
    } = this.state;
    if (!(name.length && familyName.length && email.length
        && login.length && phoneNumber.length)) {
      Alert.alert('error: empty field.');
      console.log('error, empty field');
    } else {
      updateUser(user._id, login, name, familyName, email, phoneNumber, preferences)
        .then((newUser) => {
          userChanged(newUser);
          Alert.alert('Les paramètres ont bien été modifiés');
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const { user, preferences } = this.state;
    return (
      <View style={styles.card}>
        <Text style={styles.title_set}>
          Settings
        </Text>
        <View
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Identifiant :</Text>
              <TextInput
                style={styles.title_text}
                onChangeText={this.updateLogin}
              >
                { user.login }
              </TextInput>
            </View>
          </View>
        </View>
        <View
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom :</Text>
              <TextInput
                style={styles.title_text}
                onChangeText={this.updateName}
              >
                { user.name }
              </TextInput>
            </View>
          </View>
        </View>
        <View
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom de famille :</Text>
              <TextInput
                style={styles.title_text}
                onChangeText={this.updateFamilyName}
              >
                { user.familyName }
              </TextInput>
            </View>
          </View>
        </View>
        <View
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Email :</Text>
              <TextInput
                style={styles.title_text}
                onChangeText={this.updateEmail}
              >
                { user.email }
              </TextInput>
            </View>
          </View>
        </View>
        <View
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Tél. :</Text>
              <TextInput
                style={styles.title_text}
                onChangeText={this.updatePhoneNumber}
              >
                { user.phoneNumber }
              </TextInput>
            </View>
          </View>
        </View>
        <View
          style={styles.checkboxesWrapper}
        >
          <View
            style={styles.checkboxRow}
          >
            <SettingsTagCheckbox
              checked={preferences.Rock}
              tagsChanged={this.onPreferenceChanged}
              tag="Rock"
            />
            <SettingsTagCheckbox
              checked={preferences.Rap}
              tagsChanged={this.onPreferenceChanged}
              tag="Rap"
            />
            <SettingsTagCheckbox
              checked={preferences.Classic}
              tagsChanged={this.onPreferenceChanged}
              tag="Classic"
            />
          </View>
          <View
            style={styles.checkboxRow}
          >
            <SettingsTagCheckbox
              checked={preferences.Electro}
              tagsChanged={this.onPreferenceChanged}
              tag="Electro"
            />
            <SettingsTagCheckbox
              checked={preferences.Reggae}
              tagsChanged={this.onPreferenceChanged}
              tag="Reggae"
            />
            <SettingsTagCheckbox
              checked={preferences.Metal}
              tagsChanged={this.onPreferenceChanged}
              tag="Metal"
            />
          </View>
          <View
            style={styles.checkboxRow}
          >
            <SettingsTagCheckbox
              checked={preferences.Pop}
              tagsChanged={this.onPreferenceChanged}
              tag="Pop"
            />
            <SettingsTagCheckbox
              checked={preferences.Dub}
              tagsChanged={this.onPreferenceChanged}
              tag="Dub"
            />
            <SettingsTagCheckbox
              checked={preferences.Country}
              tagsChanged={this.onPreferenceChanged}
              tag="Country"
            />
          </View>
        </View>
        <Button
          title="Modifier"
          onPress={this._onPressModify}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({
  card: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  main_container: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 20,
    overflow: 'hidden',
    margin: '1%',
  },
  content_container: {
    flexDirection: 'column',
    flex: 3,
    margin: 5,
    justifyContent: 'center',
  },
  title_container: {
    flex: 2,
    flexDirection: 'row',
  },
  title_text: {
    flexWrap: 'wrap',
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: 'white',
  },
  title_set: {
    flexWrap: 'wrap',
    fontSize: 25,
    fontWeight: 'bold',
    paddingRight: 5,
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

export default AppSettings;

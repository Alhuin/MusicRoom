import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Button, TextInput, Alert,
} from 'react-native';
import { updateUser } from '../../API/BackApi';

class AppSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.loggedUser,
      email: props.loggedUser.email,
      login: props.loggedUser.login,
      name: props.loggedUser.name,
      familyName: props.loggedUser.familyName,
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

    _onPressModify = () => {
      const {
        user, login, name, familyName, email,
      } = this.state;
      console.log(`ici:${user._id}`);
      if (!(name.length && familyName.length && email.length
          && login.length)) {
        Alert.alert('error: empty field.');
        console.log('error, empty field');
      } else {
        updateUser(user._id, login, name, familyName, email)
          .then(() => {
            Alert.alert('Settings have been modified');
          })
          .catch(error => console.log(error));
      }
    };

    render() {
      const { user } = this.state;
      console.log(user);
      return (
        <View style={styles.card}>
          <Text style={styles.title_set}>
              Settings
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.main_container}
          >
            <View style={styles.content_container}>
              <View style={styles.title_container}>
                <Text style={styles.title_text}>Login :</Text>
                <TextInput
                  style={styles.title_text}
                  onChangeText={this.updateLogin}
                >
                  { user.login }
                </TextInput>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.main_container}
          >
            <View style={styles.content_container}>
              <View style={styles.title_container}>
                <Text style={styles.title_text}>Name :</Text>
                <TextInput
                  style={styles.title_text}
                  onChangeText={this.updateName}
                >
                  { user.name }
                </TextInput>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.main_container}
          >
            <View style={styles.content_container}>
              <View style={styles.title_container}>
                <Text style={styles.title_text}>Family Name :</Text>
                <TextInput
                  style={styles.title_text}
                  onChangeText={this.updateFamilyName}
                >
                  { user.familyName }
                </TextInput>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
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
          </TouchableOpacity>
          <Button
            title="Modify"
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
});

export default AppSettings;

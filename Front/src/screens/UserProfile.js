import React from 'react';
import {
  StyleSheet, View, Text, TextInput, ScrollView,
} from 'react-native';
import {
  getUserByIdByPreferences,
} from '../../API/BackApi';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        familyName: '',
        email: '',
        phoneNumber: '',
        preferences: {},
      },
    };
  }

  componentDidMount(): void {
    const { navigation, loggedUser } = this.props;
    const userProfileId = navigation.getParam('userProfileId');
    const requesterId = loggedUser._id;
    getUserByIdByPreferences(userProfileId, requesterId)
      .then((user) => {
        this.setState({ user });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {
      user,
    } = this.state;
    let preferences = '';
    let i = 0;
    console.log(user);
    Object.keys(user.preferences).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(user.preferences, key)) {
        if (user.preferences[key] === true) {
          if (i > 0) {
            preferences += `, ${key}`;
            i += 1;
          } else {
            preferences += key;
          }
        }
      }
    });
    return (
      <ScrollView>
        <View style={styles.main_container}>
          <Text style={styles.title_set}>
            Profil utilisateur
          </Text>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <Text style={styles.textStyle}>
                  { user.name }
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Nom de famille :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <TextInput style={styles.textStyle}>
                  { user.familyName }
                </TextInput>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Email :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <Text style={styles.textStyle}>
                  { user.email }
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Tél :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <Text style={styles.textStyle}>
                  { user.phoneNumber }
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Préférences :</Text>
            </View>
            <View style={styles.content_container}>
              <View style={styles.content}>
                <Text style={styles.textStyle}>
                  {preferences}
                </Text>
              </View>
            </View>
          </View>
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
  textStyle: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    fontSize: 40,
    color: 'white',
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
    flex: 6,
    padding: 10,
    margin: 5,
  },
  touchableWrapper: {
    height: '100%',
    flexDirection: 'row',
    flex: 1,
  },
});

export default UserProfile;

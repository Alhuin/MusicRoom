import React from 'react';
import {
  StyleSheet, View, Text, ScrollView,
} from 'react-native';
import {
  getUserByIdByPreferences,
} from '../../API/BackApi';
import {
  Colors, Typography,
} from '../styles';

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
      <View style={styles.main_container}>
        <View style={Typography.screenHeader}>
          <Text style={Typography.screenHeaderText}>
            Profil
            { !user.name ? ' d\'un Anonyme' : ` de ${user.name}` }
          </Text>
        </View>
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Nom</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={Typography.bodyText}>
                { !user.name ? 'Anonyme' : user.name }
              </Text>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Nom de famille</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={Typography.bodyText}>
                { !user.familyName ? 'Anonyme' : user.familyName }
              </Text>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Email</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={Typography.bodyText}>
                { !user.email ? 'Privé' : user.email}
              </Text>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Tél</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={Typography.bodyText}>
                { !user.phoneNumber ? 'Privé' : user.phoneNumber}
              </Text>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Préférences</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={Typography.bodyText}>
                { !preferences ? 'Privé' : preferences }
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.background,
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
});

export default UserProfile;

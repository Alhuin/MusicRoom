import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';

class AppSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: global.user,
    };
  }

  render() {
    const { user } = this.state;
    return (
    /* <View style={styles.contener}>
        <Text style={styles.content}>
Login :
          { user.login }
        </Text>
        <Text style={styles.content}>
Name :
          { user.name }
        </Text>
        <Text style={styles.content}>
Family Name :
          { user.familyName }
        </Text>
        <Text style={styles.content}>
Email :
          { user.email }
        </Text>
      </View> */

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
              <Text style={styles.title_text}>
Login :
                { user.login }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>
Name :
                { user.name }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>
Family Name :
                { user.familyName }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.main_container}
        >
          <View style={styles.content_container}>
            <View style={styles.title_container}>
              <Text style={styles.title_text}>
Email :
                { user.email }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 5,
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

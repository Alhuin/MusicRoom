import React from 'react';
import {
  FlatList, StyleSheet, Platform, View,
} from 'react-native';
import { Icon } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import Components from '../components';
import { getPlaylists } from '../../API/Api';

class Home extends React.Component {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => ({
    headerTitle: 'Home ',
    headerTitleStyle: { paddingLeft: 50 },
    headerLeft: Platform.select({
      ios: null,
      android: (
        <Icon
          ios="ios-menu"
          android="md-menu"
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.toggleDrawer()}
        />
      ),
    }),
  });

  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
  }

  componentDidMount(): void {
    getPlaylists()
      .then((response) => {
        this.setState({ playlists: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }


  render() {
    const { playlists } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={playlists}
          keyExtractor={item => item._id.toString()}
          renderItem={
            ({ item }) => (
              <Components.PlaylistCollapsed
                style={styles.playlist}
                name={item.name}
                userId={-1}
              />
            )
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    // color: 'white',
  },
  playlistContainer: {
    // backgroundColor: '#999966',
    width: '100%',
  },
  playlist: {
    margin: 0,
  },
});

export default Home;

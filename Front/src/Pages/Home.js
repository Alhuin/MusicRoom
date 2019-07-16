import React from 'react';
import {
  Container, Header,
} from 'native-base';
import {
  Text, View, FlatList, StyleSheet, TextInput,
} from 'react-native';


import Components from '../Components';
import { getAllPlaylists } from '../../API/Api';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: getAllPlaylists(),
    };
  }

  componentDidMount(): void {
    this.setState({ playlists: getAllPlaylists() });
  }

  render() {
    const { playlists } = this.state;
    return (
      <Container>
        <Header androidStatusBarColor="black" style={{ display: 'none' }} />
        <View padder>
          <Text style={styles.title}>Home</Text>
          <TextInput style={styles.finder} placeholder="Rechercher..." />
          <FlatList
            style={styles.playlists}
            data={playlists}
            renderItem={
              ({ item }) => <Components.Playlist name={item.name} userId={-1} />
            }
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginContext: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
  },
  finder: {
    width: '100%',
  },
  playlists: {
    backgroundColor: 'red',
    width: '100%',
  },
  playlist: {
    margin: 0,
  },
});

export default Home;

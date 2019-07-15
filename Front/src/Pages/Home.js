import React from 'react';
import {
  Text, Container, Header, View, FlatList, StyleSheet,
} from 'native-base';
import Components from '../Components';
import { getAllPlaylists } from '../../API/Api';

class Home extends React.Component {
  render() {
    return (
      <Container>
        <Header androidStatusBarColor="black" style={{ display: 'none' }} />
        <View padder>
          <Text>Home</Text>
          <FlatList
            data={getAllPlaylists()}
            renderItem={
              ({ item }) => <Components.Playlist style={styles.playlist} name={item.name} userId={-1} />
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
  playlist: {
    margin: 0,
  },
});

export default Home;

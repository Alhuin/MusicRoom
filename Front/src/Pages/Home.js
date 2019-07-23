import React from 'react';
import {
  Container, Header, Icon, Left, Body, Right, Title, Button,
} from 'native-base';
import {
  FlatList, StyleSheet,
} from 'react-native';

import Components from '../Components';
import { getPlaylists } from '../../API/Api';

class Home extends React.Component {
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
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
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
      </Container>
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

import React from 'react';
import {
  Container, Header, Icon, Left, Body, Right, Title, Button
} from 'native-base';
import {
  Text, FlatList, StyleSheet, TextInput, ScrollView,
} from 'react-native';


import Components from '../Components';
import { getAllPlaylists } from '../../API/Api';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
  }

  componentDidMount(): void {
    getAllPlaylists().then(res => this.setState({ playlists: res }));
  }

  _keyExtractor = item => item._id;

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
        <ScrollView style={styles.scrollView}>
          <FlatList
            style={styles.playlists}
            data={playlists}
            renderItem={
              ({ item }) => <Components.PlaylistCollapsed name={item.name} />
            }
            keyExtractor={this._keyExtractor}
          />
        </ScrollView>
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
  // content: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  // loginContext: {
  //   alignItems: 'flex-end',
  // },
  title: {
    fontSize: 22,
    // color: 'white',
  },
  playlists: {
    // backgroundColor: '#999966',
    width: '100%',
  },
  playlist: {
    margin: 0,
  },
});

export default Home;

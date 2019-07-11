import React from 'react';
import {
  Text, Container, Header, Content,
} from 'native-base';

class Home extends React.Component {
  render() {
    return (
      <Container>
        <Header androidStatusBarColor="black" style={{ display: 'none' }} />
        <Content padder>
          <Text>Home</Text>
        </Content>
      </Container>
    );
  }
}

export default Home;

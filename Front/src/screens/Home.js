import React from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import Components from '../components';

class Home extends React.Component {
  state = {
    modalVisible: false,
  };

  _onPressParty = () => {
    const { navigation } = this.props;
    navigation.navigate('PartysList');
  };

  _onPressRadio = () => {
    const { navigation } = this.props;
    navigation.navigate('RadiosList');
  };

  setModalVisible = () => {
    const { modalVisible } = this.state;
    const visible = !modalVisible;
    this.setState({ modalVisible: visible });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.container}>
        <Components.JoinPrivateRoom
          setModalVisible={this.setModalVisible}
          modalVisible={modalVisible}
          userId={global.user._id}
        />
        <TouchableOpacity onPress={this._onPressParty} style={styles.cartes}>
          <View style={styles.place}>
            <Text style={styles.textcard}>Party mode</Text>
            <Icon name="musical-notes" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onPressRadio} style={styles.cartes}>
          <View style={styles.place}>
            <Text style={styles.textcard}>Radio mode</Text>
            <Icon name="radio" />
          </View>
        </TouchableOpacity>
        <Components.AddFloatingButton handlePress={() => this.setModalVisible(true)} icon="joinPrivateRoom" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    color: 'white',
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  cartes: {
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#000',
    width: '80%',
    aspectRatio: 1,
    justifyContent: 'space-around',
  },
  place: {
    alignItems: 'center',
  },
  textcard: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default Home;

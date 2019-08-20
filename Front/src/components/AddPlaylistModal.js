import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  Button,
  Alert,
} from 'react-native';
import { addPlaylist } from '../../API/BackApi';


export default class AddPlaylistModal extends React.Component {
  state = {
    switchValue: false,
    nameP: '',
  };

  _updatePlaylistName = (text) => {
    this.setState({ nameP: text });
  };

  toggleSwitch = (value) => {
    // onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    // state changes according to switch
    // which will result in re-render the text
  };

  render() {
    const { setModalVisible, modalVisible, userId } = this.props;
    const { switchValue, nameP } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
          // Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.container}>
          <View style={styles.Name}>
            <TextInput
              onChangeText={this._updatePlaylistName}
              autoCorrect={false}
              autoCapitalize="none"
              underlineColorAndroid="grey"
              style={styles.inputBox}
              placeholder="Playlist name"
            />
            <Text>{switchValue ? 'Private' : 'Public'}</Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
            <Button
              style={styles.create}
              title="Create playlist"
              onPress={() => {
                addPlaylist(nameP, switchValue, userId)
                  .then(() => {
                    setModalVisible();
                  })
                  .catch((error) => {
                    console.error(error);
                    Alert.alert('An error occured on create playlist, please try again later.');
                  });
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  Name: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  switch: {
    alignItems: 'center',
  },
  create: {
    alignItems: 'center',
  },
});

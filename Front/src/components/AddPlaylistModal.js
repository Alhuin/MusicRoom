import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
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
  }

  _updatePlaylistName = (text) => {
    this.setState({ nameP: text });
  };

  toggleSwitch = (value) => {
    // onValueChange of the switch this function will be called
    this.setState({ switchValue: value });
    // state changes according to switch
    // which will result in re-render the text
  }

  render() {
    const { setModalVisible, modalVisible } = this.props;

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
        <View styles={styles.container}>
          <View styles={styles.Name}>
            <TextInput
              onChangeText={this._updatePlaylistName}
              autoCorrect={false}
              autoCapitalize="none"
              underlineColorAndroid="grey"
              style={styles.inputBox}
              placeholder="Playlist name"
            />
            {/* eslint-disable-next-line react/destructuring-assignment */}
            <Text>{this.state.switchValue ? 'Private' : 'Public'}</Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={this.state.switchValue}
            />
            <Button
              style={styles.create}
              title="Create playlist"
              onPress={() => {
                addPlaylist(this.state.nameP, this.state.switchValue);
                // .then(() => {
                //   setModalVisible();
                //   // eslint-disable-next-line max-len
                // eslint-disable-next-line max-len
                //   // ici problem de retour de promess dans back API a faire sinon les arg et tout passe bien
                // })
                // .catch((error) => {
                //   console.error(error);
                //   Alert.alert('An error occured on create playlist, please try again later.');
                // });
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
    marginTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  Name: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  switch: {
    alignItems: 'center',
  },
  create: {
    alignItems: 'center',
  },
});

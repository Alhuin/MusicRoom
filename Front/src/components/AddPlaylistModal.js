import React from 'react';
import DatePicker from 'react-native-date-picker';
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
    location: null, // unused afficher car on n'envoie pas encore la location quelquepart.
    type: null,
    date: new Date(),
  };

  _updatePlaylistName = (text) => {
    this.setState({ nameP: text });
  };

  toggleSwitch = (value) => {
    // onValueChange of the switch this function will be called
    // this.state.location = info conplete de geoloc
    navigator.geolocation.getCurrentPosition(
      position => {
        const MyLocation = JSON.stringify(position);
        this.setState({ location: MyLocation });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: false, timeout: 10000 },
    );
    this.setState({ switchValue: value });
    if (this.state.type === null) {
      this.setState({ type: 'GeolocOK' });
    } else {
      this.setState({ type: null });
    }
  };

  render() {
    const {
      setModalVisible,
      modalVisible,
      userId,
      roomType,
      updatePlaylist,
    } = this.props;
    const { switchValue, nameP } = this.state;
    let dateP;
    let datePTwo;

    if (this.state.type === 'GeolocOK') {
      dateP = <DatePicker
        date={this.state.date}
        onDateChange={date => this.setState({ date })}
      />;
      datePTwo = <DatePicker
        date={this.state.date}
        onDateChange={date => this.setState({ date })}
      />;
    } else {
      dateP = <Text></Text>;
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
          updatePlaylist();
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
            <Text>{switchValue ? 'Public' : 'Private'}</Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
            <Text> { switchValue ? 'Geolocation is ON for public party' : '' }</Text>
            {dateP}
            {datePTwo}
            <Button
              style={styles.create}
              title="Create playlist"
              onPress={() => {
                addPlaylist(nameP, switchValue, userId, userId, roomType)
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

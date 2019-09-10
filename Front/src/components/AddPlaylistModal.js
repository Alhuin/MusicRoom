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
    namePlaylist: '',
    location: null, // unused afficher car on n'envoie pas encore la location quelquepart.
    type: null,
    date: new Date(),
    dateTwo: new Date(),
  };

  _updatePlaylistName = (text) => {
    this.setState({ namePlaylist: text });
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

  generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    return randomNumber;
  }

  generatePrivateId() {
    let i = 0;
    let MyId = '';
    while (i < 4) {
      MyId = MyId + '' + this.generateRandomNumber();
      i += 1;
    }
    return MyId;
  }

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
          dateTwo={this.state.date}
          onDateChange={dateTwo => this.setState({ dateTwo })}
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
                    /*
                        console.log(this.generatePrivateId());
                        console.log(this.state.date);
                        console.log(this.state.dateTwo);
                        console.log(this.state.switchValue);
                        console.log(this.state.namePlaylist);
                       // BESOIN D'ADAPTER L'ENVOIE A BACKAPI JUSTE EN DESDOUS
                     */
                    this.generatePrivateId();
                    addPlaylist(this.state.namePlaylist, switchValue, userId, userId, roomType)
                        .then(() => {
                          setModalVisible();
                          updatePlaylist();
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

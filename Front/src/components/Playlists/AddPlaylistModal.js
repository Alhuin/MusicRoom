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
import { addPlaylist } from '../../../API/BackApi';
import DatePickerModal from './DatePickerModal';


export default class AddPlaylistModal extends React.Component {
  state = {
    switchValue: false,
    namePlaylist: '',
    location: null, // unused afficher car on n'envoie pas encore la location quelque part.
    type: null,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000),
    datePickerModalVisible: false,
    dateType: '',
  };

  onDateChanged = (changedDate) => {
    const { dateType } = this.state;
    if (dateType === 'start') {
      this.setState({ startDate: changedDate });
    } else if (dateType === 'end') {
      this.setState({ endDate: changedDate });
    }
  };

  /* onEndDateChanged = (changedText) => {
    console.log('This is the changed text: ', changedText);
  } */

  _updatePlaylistName = (text) => {
    this.setState({ namePlaylist: text });
  };

  setModalVisible = (dateType) => {
    const { datePickerModalVisible } = this.state;
    const visible = !datePickerModalVisible;
    if (dateType !== undefined) {
      this.setState({ dateType, datePickerModalVisible: visible });
    } else {
      this.setState({ datePickerModalVisible: visible });
    }
  };

  toggleSwitch = (value) => {
    // onValueChange of the switch this function will be called
    // Navigator sort d'ou ?
    const { type } = this.state;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const MyLocation = JSON.stringify(position);
        this.setState({ location: MyLocation });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: false, timeout: 10000 },
    );
    this.setState({ switchValue: value });
    if (type === null) {
      this.setState({ type: 'GeolocOK' });
    } else {
      this.setState({ type: null });
    }
  };

  generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    return randomNumber;
  };

  generatePrivateId() {
    let i = 0;
    let MyId = '';
    while (i < 4) {
      MyId = `${MyId}${this.generateRandomNumber()}`;
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
      loggedUser,
      socket,
    } = this.props;
    const {
      switchValue, type, startDate, endDate, location, namePlaylist, datePickerModalVisible,
    } = this.state;
    let dateP = (null);
    let datePTwo = (null);
    if (type === 'GeolocOK') {
      dateP = (
        <View
          style={{ alignItems: 'center' }}
        >
          <View>
            <Text>
              Date de début :
            </Text>
            <Text>
              {String(startDate)}
            </Text>
          </View>
          <View
            style={{ width: '40%' }}
          >
            <Button
              title="Date de début"
              onPress={() => {
                this.setModalVisible('start');
              }}
            />
          </View>
        </View>
      );
      datePTwo = (
        <View
          style={{ alignItems: 'center' }}
        >
          <View>
            <Text>
              Date de fin :
            </Text>
            <Text>
              {String(endDate)}
            </Text>
          </View>
          <View
            style={{ width: '30%' }}
          >
            <Button
              title="Date de fin"
              onPress={() => {
                this.setModalVisible('end');
              }}
            />
          </View>
        </View>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
          updatePlaylist();
        }}
      >
        <View style={styles.container}>
          <DatePickerModal
            setModalVisible={this.setModalVisible}
            DateModalVisible={datePickerModalVisible}
            onDateChanged={this.onDateChanged}
          />
          <View style={styles.Name}>
            <TextInput
              onChangeText={this._updatePlaylistName}
              autoCorrect={false}
              autoCapitalize="none"
              underlineColorAndroid="grey"
              style={styles.inputBox}
              placeholder="Nom"
            />
            <Text>{switchValue ? 'Publique' : 'Privée'}</Text>
            <Switch
              style={styles.switch}
              onValueChange={this.toggleSwitch}
              value={switchValue}
            />
            <Text>
              {' '}
              { switchValue ? 'La géolocalisation est activée pour les Parties' : '' }
            </Text>
            {dateP}
            {datePTwo}
            <Button
              style={styles.create}
              title="Créer la playlist"
              onPress={() => {
                /* console.log(this.generatePrivateId());
                console.log(this.state.startDate);
                console.log(this.state.endDate);
                console.log(this.state.switchValue);
                console.log(this.state.namePlaylist);
                console.log(this.state.location);
                // BESOIN D'ADAPTER L'ENVOIE A BACKAPI JUSTE EN
                // DESDOUS ET DE RECUP SUR LES MODAL LES DATE
*/
                if (startDate < endDate && namePlaylist) {
                  addPlaylist(namePlaylist, switchValue, userId, userId, loggedUser.name,
                    userId, roomType, startDate, endDate, location, this.generatePrivateId())
                    .then(() => {
                      if (roomType === 'party') {
                        socket.emit('addParty');
                      } else {
                        socket.emit('addRadio');
                      }
                      setModalVisible();
                      updatePlaylist();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                } else if (startDate >= endDate) {
                  Alert.alert('Veuillez choisir deux dates compatibles.');
                } else if (!namePlaylist) {
                  Alert.alert('Veuillez choisir un nom pour votre playlist.');
                }
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
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  Name: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '40%',
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

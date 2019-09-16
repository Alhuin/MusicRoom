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
import DatePickerModal from './DatePickerModal';


export default class AddPlaylistModal extends React.Component {
  state = {
    switchValue: false,
    namePlaylist: '',
    location: null, // unused afficher car on n'envoie pas encore la location quelquepart.
    type: null,
    date: new Date(),
    dateTwo: new Date(),
    dateMarkeur: 0,
    DateModalVisible: false,
  };

  onStartDateChanged = (changedDate) => {
    if (this.state.dateMarkeur === 1) {
      this.setState({ date: changedDate });
    } else {
      this.setState({ dateTwo: changedDate });
    }
  }

  /* onEndDateChanged = (changedText) => {
    console.log('This is the changed text: ', changedText);
  } */

  _updatePlaylistName = (text) => {
    this.setState({ namePlaylist: text });
  };

  setModalVisible = () => {
    const { DateModalVisible } = this.state;
    const visible = !DateModalVisible;
    this.setState({ DateModalVisible: visible });
  };

  toggleSwitch = (value) => {
    // onValueChange of the switch this function will be called
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
    } = this.props;
    const { switchValue } = this.state;
    let dateP;
    let datePTwo;
    if (this.state.type === 'GeolocOK') {
      dateP = (
        <Button
          style={styles.dates}
          title="Start time"
          onPress={() => {
            this.setState({ dateMarkeur: 1 });
            this.setModalVisible();
          }}
        />
      );
      datePTwo = (
        <Button
          style={styles.dates}
          title="End time"
          onPress={() => {
            this.setState({ dateMarkeur: 2 });
            this.setModalVisible();
          }}
        />
      );
    } else {
      dateP = <Text />;
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
            DateModalVisible={this.state.DateModalVisible}
            dateMarkeur={this.state.dateMarkeur}
            onStartDateChanged={this.onStartDateChanged}
          />
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
            <Text>
              {' '}
              { switchValue ? 'Geolocation is ON for public party' : '' }
            </Text>
            {dateP}
            {datePTwo}
            <Button
              style={styles.create}
              title="Create playlist"
              onPress={() => {
                /* console.log(this.generatePrivateId());
                console.log(this.state.date);
                console.log(this.state.dateTwo);
                console.log(this.state.switchValue);
                console.log(this.state.namePlaylist);
                console.log(this.state.location);
                // BESOIN D'ADAPTER L'ENVOIE A BACKAPI JUSTE EN
                // DESDOUS ET DE RECUP SUR LES MODAL LES DATE
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
    margin: '1%',
  },
  Name: {
    alignItems: 'center',
    margin: '1%',
  },
  switch: {
    alignItems: 'center',
    margin: '1%',
  },
  create: {
    alignItems: 'center',
    margin: '1%',
  },
  dates: {
    margin: '1%',
  },
});

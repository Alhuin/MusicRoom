import React from 'react';
import {
  Modal, StyleSheet, Text, View, TextInput, Switch, Alert, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { addPlaylist } from '../../../API/BackApi';
import DatePickerModal from './DatePickerModal';
import { Colors, Buttons, Typography } from '../../styles';
import {Icon} from "native-base";

export default class AddPlaylistModal extends React.Component {
  state = {
    switchValue: true,
    namePlaylist: '',
    location: {},
    type: 'GeolocOK',
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
    const { type } = this.state;
    const { roomType } = this.props;
    if (roomType === 'party') {
      if (type === null) {
        this.setState({ type: 'GeolocOK' });
        // eslint-disable-next-line no-undef
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({ location: position });
          },
          error => Alert.alert(
            `${error.message}\nÀ configurer à la main`,
          ),
          { enableHighAccuracy: false, timeout: 10000 },
        );
      } else {
        this.setState({ type: null });
      }
    }
    this.setState({ switchValue: value });
  };

  generateRandomNumber = () => Math.floor(Math.random() * 1000) + 1;

  onPressed = () => {
    const {
      setModalVisible, userId, roomType, loggedUser, socket,
    } = this.props;
    const {
      switchValue, startDate, endDate, location, namePlaylist,
    } = this.state;
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
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (startDate >= endDate) {
      Alert.alert('Veuillez choisir deux dates compatibles.');
    } else if (!namePlaylist) {
      Alert.alert('Veuillez choisir un nom pour votre playlist.');
    }
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
      setModalVisible, modalVisible, roomType,
    } = this.props;
    const {
      switchValue, type, startDate, endDate, datePickerModalVisible,
    } = this.state;
    let roomCapitalized = 'Party';
    if (roomType === 'radio') {
      roomCapitalized = 'Radio';
    }
    let dateP = null;
    let datePTwo = null;
    if (type === 'GeolocOK' && roomType === 'party') {
      dateP = (
        <View>
          <View style={Typography.section}>
            <View style={Typography.sectionHeader}>
              <Text style={Typography.sectionHeaderText}>
                Début de l&apos;événement
              </Text>
            </View>
            <View style={[Typography.sectionContent, { alignItems: 'center' }]}>
              <Text style={Typography.bodyText}>
                {String(startDate)}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setModalVisible('start');
                }}
                style={Buttons.largeButton}
              >
                <Text style={Buttons.text}>
                  Modifier
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
        </View>
      );
      datePTwo = (
        <View>
          <View style={Typography.section}>
            <View style={Typography.sectionHeader}>
              <Text style={Typography.sectionHeaderText}>
                Fin de l&apos;événement
              </Text>
            </View>
            <View style={[Typography.sectionContent, { alignItems: 'center' }]}>
              <Text style={Typography.bodyText}>
                {String(endDate)}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setModalVisible('end');
                }}
                style={Buttons.largeButton}
              >
                <Text style={Buttons.text}>
                  Modifier
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
        </View>
      );
    }

    let returnIconForiOS = (null);
    if (Platform.OS === 'ios') {
      returnIconForiOS = (
        <TouchableOpacity
          onPress={() => {
            setModalVisible();
          }}
          style={styles.iconWrapper}
        >
          <Icon name="ios-arrow-back" style={Typography.icon} />
        </TouchableOpacity>
      );
    }
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
        }}
      >
        <ScrollView style={styles.container}>
          <DatePickerModal
            setModalVisible={this.setModalVisible}
            DateModalVisible={datePickerModalVisible}
            onDateChanged={this.onDateChanged}
          />
          <View style={Typography.screenHeader}>
            <Text style={Typography.screenHeaderText}>
              Créer une playlist
            </Text>
          </View>
          <View styles={Typography.section}>
            <View style={[Typography.sectionContent, { alignItems: 'center' }]}>
              <Text style={Typography.bodyText}>
                La playlist sera une
                {' '}
                {roomCapitalized}
              </Text>
            </View>
          </View>
          <View styles={Typography.section}>
            <View style={Typography.sectionHeader}>
              <Text style={Typography.sectionHeaderText}>
                Nom de la playlist
              </Text>
            </View>
            <View style={Typography.sectionContent}>
              <TextInput
                onChangeText={this._updatePlaylistName}
                style={styles.textInput}
                placeholder="Écrire ici"
                placeholderTextColor={Colors.placeholder}
              />
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          <View style={Typography.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                Visibilité
              </Text>
            </View>
            <View style={[Typography.sectionContent, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={Typography.bodyText}>
                Publique
              </Text>
              <Switch
                style={styles.switch}
                onValueChange={this.toggleSwitch}
                value={switchValue}
                thumbColor={switchValue ? Colors.button : Colors.buttonDisabled}
              />
            </View>
          </View>
          <View style={Typography.sectionSeparator} />
          {dateP}
          {datePTwo}
          <View styles={Typography.section}>
            <View style={[Typography.sectionContent, { alignItems: 'center' }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.onPressed();
                }}
                style={Buttons.largeButton}
              >
                <Text style={Buttons.text}>
                  Créer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {returnIconForiOS}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  switch: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    ...Typography.textInput,
  },
  iconWrapper: {
    ...Typography.iconWrapper,
    position: 'absolute',
    top: 12,
    left: 12,
  },
});

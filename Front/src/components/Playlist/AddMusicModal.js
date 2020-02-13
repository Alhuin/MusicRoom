import React from 'react';
import {
  Modal, Platform, Text, TouchableOpacity, View,
} from 'react-native';
import { Icon } from 'native-base';
import SearchTrack from '../SearchTrack/SearchTrack';
import { Typography } from '../../styles';


export default class AddMusicModal extends React.Component {
  render() {
    const {
      setModalVisible, modalVisible, playlistId, userId, updateTracks, roomType,
    } = this.props;

    let returnIconForiOS = (null);
    if (Platform.OS === 'ios') {
      returnIconForiOS = (
        <TouchableOpacity
          onPress={() => {
            setModalVisible();
          }}
          style={{
            ...Typography.iconWrapper,
            position: 'absolute',
            top: 12,
            left: 12,
          }}
        >
          <Icon name="ios-arrow-back" style={Typography.icon} />
        </TouchableOpacity>
      );
    }
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
        <View style={Typography.screenHeader}>
          <Text style={Typography.screenHeaderText}>
            Ajout de musique
          </Text>
        </View>
        <SearchTrack
          playlistId={playlistId}
          setModalVisible={setModalVisible}
          userId={userId}
          updateTracks={updateTracks}
          roomType={roomType}
        />
        {returnIconForiOS}
      </Modal>
    );
  }
}

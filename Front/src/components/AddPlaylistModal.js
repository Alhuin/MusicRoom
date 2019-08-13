import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';


export default class AddPlaylistModal extends React.Component {
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
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Add Playlist</Text>

            <TouchableHighlight
              onPress={() => {
                setModalVisible();
              }}
            >
              <Text>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    transform: [{ translateX: +2 }],
    height: 30,
    width: 30,
    color: 'white',
  },
});

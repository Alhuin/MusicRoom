import React from 'react';
import {
  Modal, StyleSheet, TextInput, View, Text, Alert,
} from 'react-native';
import { joinPlaylistWithCode } from '../../../API/BackApi';

export default class JoinPrivateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  joinRoom = () => {
    const { userId, setModalVisible, shouldUpdatePlaylist } = this.props;
    const { text } = this.state;
    joinPlaylistWithCode(userId, text)
      .then((playlist) => {
        shouldUpdatePlaylist(true);
        setModalVisible();
        Alert.alert(
          'Rejoindre une playlist',
          `Vous avez désormais accès à la ${playlist.roomType} ${playlist.name} !`,
        );
      })
      .catch((error) => {
        setModalVisible();
        if (error.status === 404) {
          Alert.alert('Code inconnu', 'Ce code ne correspond à aucune playlist !');
        } else {
          Alert.alert('Rejoindre une playlist', 'La demande a rencontré une erreur.');
        }
      });
  };

  render() {
    const {
      setModalVisible, modalVisible,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible();
        }}
      >
        <Text
          style={styles.title}
        >
          Rejoindre une Playlist Privée
        </Text>
        <View
          style={styles.container}
        >
          <TextInput
            style={styles.textInput}
            placeholder="Entrez le code ici"
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={this.joinRoom}
            keyboardType="numeric"
          />
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#888888',
    width: '70%',
    fontSize: 28,
    textAlign: 'center',
  },
});

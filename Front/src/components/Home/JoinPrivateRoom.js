import React from 'react';
import {
  Modal, StyleSheet, TextInput, View, Text, Alert,
} from 'react-native';
import { joinPlaylistWithCode } from '../../../API/BackApi';
import {
  Colors, Typography,
} from '../../styles';

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
          `Vous avez désormais accès à la playlist ${playlist.name}, c'est une ${playlist.roomType} !`,
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
        <View style={styles.main_container}>
          <View style={Typography.screenHeader}>
            <Text style={Typography.screenHeaderText}>
              Rejoindre une Playlist Privée
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { marginTop: 20 }]}>Code Privé</Text>
            </View>
            <View style={styles.sectionContent}>
              <TextInput
                style={Typography.textInput}
                placeholder="Entrez le code ici"
                placeholderTextColor={Colors.baseText}
                onChangeText={text => this.setState({ text })}
                onSubmitEditing={this.joinRoom}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    ...Typography.section,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
  },
  sectionHeaderText: {
    ...Typography.sectionHeaderText,
  },
  sectionContent: {
    ...Typography.sectionContent,
  },
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

import React from 'react';
import {
  Modal, StyleSheet, TextInput, View, Text,
} from 'react-native';
import { joinRoom } from '../../API/BackApi';

export default class JoinPrivateRoom extends React.Component {
  state = {
    text: '',
  };

  _joinRoom = () => {
    const { userId, setModalVisible } = this.props;
    const { text } = this.state;
    setModalVisible();
    alert('La demande a rencontrée une erreur.');
/*    joinRoom(userId, text)
      .then(() => {
        setModalVisible();
        alert(`Demande d'ajout à [${text}] prise en compte.`);
      })
      .catch((error) => {
        setModalVisible();
        alert('La demande a rencontrée une erreur.');
        console.error(error);
      });*/
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
          Rejoindre une Room Privée
        </Text>
        <View
          style={styles.container}
        >

          <TextInput
            style={styles.textInput}
            placeholder="Entrez le code ici"
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={this._joinRoom}
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

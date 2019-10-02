import React from 'react';
import {
  Modal, StyleSheet, TouchableHighlight, Text,
} from 'react-native';
import DatePicker from 'react-native-date-picker';


export default class AddMusicModal extends React.Component {
  state = { date: new Date() }

  render() {
    const {
      setModalVisible,
      DateModalVisible,
    } = this.props;
    return (
      <Modal
        style={styles.Date}
        animationType="fade"
        transparent={false}
        visible={DateModalVisible}
        onRequestClose={() => {
          setModalVisible();
        }}
      >
        <DatePicker
          date={this.state.date}
          onDateChange={date => this.setState({ date })}
        />
        <TouchableHighlight
          onPress={() => {
            this.props.onStartDateChanged(this.state.date);
            setModalVisible();
          }}
        >
          <Text style={styles.hide}>Set date</Text>
        </TouchableHighlight>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  Date: {
    alignItems: 'center',
  },
  hide: {
    alignItems: 'center',
    fontSize: 22,
    marginTop: '5%',
    marginLeft: '35%',
  },
});

import React from 'react';
import {
  Modal, StyleSheet, TouchableOpacity, Text, View, Platform,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Colors, Buttons, Typography} from '../../styles';
import {Icon} from "native-base";

export default class DatePickerModal extends React.Component {
  state = {
    date: new Date(),
  };

  componentDidMount(): void {
    const { initialDate } = this.props;
    if (initialDate !== undefined) {
      this.setState({ date: initialDate });
    }
  }

  render() {
    const {
      setModalVisible,
      DateModalVisible,
      onDateChanged,
      initialDate,
    } = this.props;
    const { date } = this.state;
    let usedDate = date;
    if (initialDate !== undefined) {
      usedDate = initialDate;
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
        style={{ flex: 1 }}
        animationType="fade"
        transparent={false}
        visible={DateModalVisible}
        onRequestClose={() => {
          setModalVisible();
        }}
      >
        <View style={styles.Date}>
          <DatePicker
            date={usedDate}
            onDateChange={Date => this.setState({ date: Date })}
            textColor={Colors.baseText}
            fadeToColor="none"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onDateChanged(date);
              setModalVisible();
            }}
            style={Buttons.largeButton}
          >
            <Text style={Buttons.text}>Confirmer</Text>
          </TouchableOpacity>
        </View>
        {returnIconForiOS}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  Date: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  iconWrapper: {
    ...Typography.iconWrapper,
    position: 'absolute',
    top: 12,
    left: 12,
  },
});

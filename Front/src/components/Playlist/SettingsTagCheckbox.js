import {
  View, StyleSheet,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Text } from 'native-base';
import React, { Component } from 'react';
import { Colors } from '../../styles';

export default class SettingsTagCheckbox extends Component {
  render() {
    const {
      tag, tagsChanged, checked, textStyle,
    } = this.props;
    return (
      <View
        style={styles.container}
      >
        <CheckBox
          isChecked={checked}
          onClick={() => {
            tagsChanged(tag);
          }}
          checkBoxColor={Colors.button}
        />
        <Text
          style={textStyle}
        >
          {tag}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import {
  View, StyleSheet, CheckBox,
} from 'react-native';
import { Text } from 'native-base';
import React, { Component } from 'react';

export default class SettingsTagCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,

    };
  }

  render() {
    const { tag, tagsChanged } = this.props;
    const { checked } = this.state;
    return (
      <View
        style={styles.container}
      >
        <CheckBox
          value={checked !== undefined}
          onValueChange={() => {
            tagsChanged(tag);
            this.setState({ checked: !checked });
          }}
        />
        <Text>
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

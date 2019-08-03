import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default class SearchBar extends React.Component {
  render() {
    const { updateSearchedText, searchTracks } = this.props;
    return (
      <TextInput
        style={styles.textInput}
        placeholder="Titre du film"
        // style={/*lesStylesDeTaMaman*/}
        onChangeText={text => updateSearchedText(text)}
        onSubmitEditing={() => {
          searchTracks();
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    color: 'white',
  },
});

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default class SearchBar extends React.Component {
  render() {
    const { updateSearchedText, searchTracks } = this.props;
    return (
      <TextInput
        style={styles.textInput}
        placeholder="Cliquer ici pour rechercher une musique"
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
    backgroundColor: '#666666',
  },
});

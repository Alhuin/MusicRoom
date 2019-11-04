import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default class SearchBar extends React.Component {
  render() {
    const { updateSearchedText, searchTracks, autoSearch } = this.props;
    if (autoSearch) { // Automatic search upon typing ( used in playlist searchBar )
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Cliquer ici pour rechercher une musique"
          onChangeText={text => searchTracks(text)}
          autoCorrect={false}
        />
      );
    }
    return ( // search on submit ( used in addMusicModal )
      <TextInput
        style={styles.textInput}
        placeholder="Cliquer ici pour rechercher une musique"
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

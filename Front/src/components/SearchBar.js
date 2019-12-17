import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Typography } from '../styles';
import * as Colors from '../styles/colors';

export default class SearchBar extends React.Component {
  render() {
    const { updateSearchedText, searchTracks, autoSearch } = this.props;
    if (autoSearch) { // Automatic search upon typing ( used in playlist searchBar )
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Cliquer ici pour rechercher une musique"
          placeholderTextColor={Colors.placeholder}
          onChangeText={text => searchTracks(text)}
          autoCorrect={false}
        />
      );
    }
    return ( // search on submit ( used in addMusicModal )
      <TextInput
        style={styles.textInput}
        placeholder="Cliquer ici pour rechercher une musique"
        placeholderTextColor={Colors.placeholder}
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
    ...Typography.textInput,
  },
});

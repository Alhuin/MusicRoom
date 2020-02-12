import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Typography } from '../styles';
import * as Colors from '../styles/colors';

export default class SearchBar extends React.Component {
  render() {
    const {
      updateSearchedText,
      searchTracks,
      autoSearch,
      type,
    } = this.props;
    if (autoSearch) { // Automatic search upon typing ( used in playlist searchBar )
      return (
        <TextInput
          style={styles.textInput}
          placeholder={type === 'search' ? 'Rechercher une musique dans la playlist' : 'Ajouter une musique à la playlist'}
          placeholderTextColor={Colors.placeholder}
          onChangeText={text => searchTracks(text)}
          autoCorrect={false}
          autoCapitalize="none"
        />
      );
    }
    return ( // search on submit ( used in addMusicModal )
      <TextInput
        style={styles.textInput}
        placeholder={type === 'search' ? 'Rechercher une musique dans la playlist' : 'Ajouter une musique à la playlist'}
        placeholderTextColor={Colors.placeholder}
        onChangeText={text => updateSearchedText(text)}
        onSubmitEditing={() => {
          searchTracks();
        }}
        autoCapitalize="none"
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    ...Typography.textInput,
  },
});

import React from 'react';

// DISABLE BACK ARROW ON NEXT PAGES

class Entry extends React.Component {

  componentDidMount() {
    const { navigation } = this.props;
    navigation.navigate('Connexion', { type: 'Sign Up' });
  }

  render() {
    return null;
  }
}

export default Entry;

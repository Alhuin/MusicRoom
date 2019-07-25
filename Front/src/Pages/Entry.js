import React from 'react';
import {
  Platform, Linking,
} from 'react-native';

// DISABLE BACK ARROW ON NEXT PAGES

class Entry extends React.Component {
  componentDidMount() {
    Linking.getInitialURL()
      .then((url) => {
        console.log(url);
        const { navigation } = this.props;
        if (url) {
          if (Platform.OS === 'android') {
            const params = this.parseUrl(url);
            console.log(params);
            if (params.page !== undefined) {
              if (params.data !== undefined) {
                console.log(`page = ${params.page}`);
                navigation.navigate(params.page, { data: params.data });
              }
              navigation.navigate(params.page);
            }
          } else if (Platform.OS === 'ios') {
            Linking.addEventListener('url', this.handleOpenURL);
          }
        } else {
          navigation.navigate('Connexion');
        }
      })
      .catch(error => console.error(error));
  }

  parseUrl = (url) => {
    const params = url.split('musicroom://music/')[1].replace('%20', ' ');
    const ret = {};
    [ret.page, ret.data] = params.split('/');
    return ret;
  };

  handleOpenURL = (event) => {
    const { navigation } = this.props;
    const [page, data] = this.parseUrl(event.url);
    if (page !== undefined) {
      if (data !== undefined) {
        navigation.navigate(page, { data });
      }
      navigation.navigate(page);
    }
  };

  render() {
    return null;
  }
}

export default Entry;

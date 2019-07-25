import React from 'react';
import {
  Platform, Linking,
} from 'react-native';

// DISABLE BACK ARROW ON NEXT PAGES

class Entry extends React.Component {
  // componentDidMount() {
  //   const {navigation} = this.props;
  //   Linking.addEventListener('url', this._handleOpenURL);
  //   navigation.navigate('Connexion');
  // }
  //
  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this._handleOpenURL);
  // }
  //
  //
  //
  //
  // _handleOpenURL(url) {
  //   console.log(url);
  //   const {navigation} = this.props;
  //   if (url) {
  //     const params = this.parseUrl(url);
  //     console.log(params);
  //     if (params.page !== undefined) {
  //       if (params.data !== undefined) {
  //         console.log(`page = ${params.page}`);
  //         navigation.navigate(params.page, {data: params.data});
  //       }
  //       navigation.navigate(params.page);
  //     }
  //   }
  // }

  componentDidMount() {
    const { navigation } = this.props;
    Linking.addEventListener('url', this._handleOpenURL);
    navigation.navigate('Connexion');
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    console.log(event.url);
    console.log(this);
    if (event.url) {
      const [page, data] = event.url.split('musicroom://music/')[1].replace('%20', ' ').split('/');
      if (page !== undefined) {
        if (data !== undefined) {
          console.log(`page = ${page} with data = ${data}`);
          this.navigator.navigate(page, { data });
        }
        console.log(`page = ${page}`);
        this.navigator.navigate(page);
      }
    }
  }

  render() {
    return null;
  }
}

export default Entry;

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Navigation from './src/navigation/Navigation';
import store from './src/store';
import AdminPlayer from './src/containers/AdminPlayer';


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
        <AdminPlayer />
      </Provider>
    );
  }
}

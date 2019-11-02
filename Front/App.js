import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store/store';
import Navigation from './src/navigation/Navigation';
import AdminPlayer from './src/containers/AdminPlayer';


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
          <AdminPlayer />
        </PersistGate>
      </Provider>
    );
  }
}
